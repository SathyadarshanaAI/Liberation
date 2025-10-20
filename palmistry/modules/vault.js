// modules/vault.js
// Offline research vault: persist scans + analysis, list, delete, and export JSONL/CSV.

const DB_NAME = 'palmistry_vault_v2';
const STORE   = 'records';

//// IndexedDB core ////////////////////////////////////////////////////////////
function openDB() {
  return new Promise((res, rej) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        const os = db.createObjectStore(STORE, { keyPath: 'id' });
        os.createIndex('by_time', 'timestamp');
        os.createIndex('by_hand', 'hand');
      }
    };
    req.onsuccess = () => res(req.result);
    req.onerror = () => rej(req.error);
  });
}
async function withStore(mode, fn) {
  const db = await openDB();
  return new Promise((res, rej) => {
    const tx = db.transaction(STORE, mode);
    const st = tx.objectStore(STORE);
    const p = fn(st);
    tx.oncomplete = () => res(p);
    tx.onerror = () => rej(tx.error);
  });
}

//// Public API ////////////////////////////////////////////////////////////////

/**
 * Save a complete analysis record.
 * @param {Object} rec { id?, hand, image, thumb, structures, features, evidences, fusion:{traits,global,report}, consent }
 * @returns {string} id
 */
export async function saveAnalysis(rec) {
  const id = rec.id || makeId(rec.hand);
  const now = Date.now();
  const doc = {
    id,
    timestamp: rec.timestamp || now,
    hand: rec.hand || 'unknown',
    image: rec.image || null,     // dataURL (optional, can be null)
    thumb: rec.thumb || null,     // small dataURL (recommended)
    structures: rec.structures || {},
    features: rec.features || {},
    evidences: rec.evidences || [],
    fusion: rec.fusion || { traits:{}, global:{}, report:{} },
    consent: !!rec.consent,       // opt-in to research exports
    meta: rec.meta || {}
  };
  await withStore('readwrite', st => st.put(doc));
  return id;
}

export async function getRecord(id) {
  return withStore('readonly', st => new Promise((res, rej) => {
    const r = st.get(id); r.onsuccess = () => res(r.result || null); r.onerror = () => rej(r.error);
  }));
}

export async function listRecords({ hand, limit = 500, onlyConsent = false } = {}) {
  return withStore('readonly', st => new Promise((res, rej) => {
    const out = [];
    const idx = st.index('by_time');
    const r = idx.openCursor(null, 'prev');
    r.onsuccess = () => {
      const cur = r.result;
      if (!cur) return res(out);
      const v = cur.value;
      if ((!hand || v.hand === hand) && (!onlyConsent || v.consent)) out.push(v);
      if (out.length >= limit) return res(out);
      cur.continue();
    };
    r.onerror = () => rej(r.error);
  }));
}

export async function removeRecord(id) {
  return withStore('readwrite', st => st.delete(id));
}

export async function clearAll() {
  return withStore('readwrite', st => st.clear());
}

//// Exports ///////////////////////////////////////////////////////////////////

/** Export to JSONL (one record per line). */
export async function exportJSONL({ consentOnly = true } = {}) {
  const rows = await listRecords({ onlyConsent: consentOnly, limit: 100000 });
  const lines = rows.map(r => JSON.stringify(minRec(r)));
  return lines.join('\n');
}

/** Export condensed CSV (traits + minimal meta). */
export async function exportCSV({ consentOnly = true, traitOrder } = {}) {
  const rows = await listRecords({ onlyConsent: consentOnly, limit: 100000 });
  if (!rows.length) return 'id,hand,timestamp\n';

  // Build union of trait keys if order not provided
  const union = new Set(traitOrder || []);
  if (!traitOrder) rows.forEach(r => Object.keys(r.fusion?.traits || {}).forEach(k => union.add(k)));
  const traits = traitOrder || Array.from(union);

  const head = ['id','hand','timestamp', ...traits.map(t => `${t}_score`), ...traits.map(t => `${t}_conf`)];
  const lines = [head.join(',')];

  for (const r of rows) {
    const t = r.fusion?.traits || {};
    const scores = traits.map(k => num(t[k]?.score));
    const confs  = traits.map(k => fix(t[k]?.confidence, 3));
    lines.push([r.id, r.hand, r.timestamp, ...scores, ...confs].join(','));
  }
  return lines.join('\n');
}

/** Trigger a browser download of a given text payload. */
export function downloadText(filename, text, mime = 'text/plain;charset=utf-8') {
  const blob = new Blob([text], { type: mime });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

//// Helpers //////////////////////////////////////////////////////////////////

function minRec(r) {
  return {
    id: r.id,
    hand: r.hand,
    timestamp: r.timestamp,
    consent: !!r.consent,
    // keep images out of research by default (can be re-enabled)
    // image: r.image, thumb: r.thumb,
    features: r.features,
    evidences: r.evidences.map(e => ({ id: e.id, target: e.target, score: e.score, conf: e.conf })),
    traits: Object.fromEntries(Object.entries(r.fusion?.traits || {}).map(([k,v]) => [k, {
      score: num(v.score), confidence: fix(v.confidence,3), votes: v.votes||0
    }])),
    global: r.fusion?.global || {}
  };
}
function num(x){ const n=Number(x); return Number.isFinite(n)?Math.round(n):0; }
function fix(x,k=3){ const n=Number(x); if(!Number.isFinite(n)) return 0; const p=10**k; return Math.round(n*p)/p; }
function makeId(hand='R'){ const t=new Date(); const pad=n=>String(n).padStart(2,'0');
  return `scan_${t.getFullYear()}-${pad(t.getMonth()+1)}-${pad(t.getDate())}_${pad(t.getHours())}-${pad(t.getMinutes())}-${pad(t.getSeconds())}_${hand[0].toUpperCase()}`;
}
