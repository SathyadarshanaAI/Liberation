// modules/why.js
// Minimal, framework-free "Why Drawer" for traits & evidences.
// Mounts a floating panel; call showWhy({traits, report, global, scanMeta, evidences})

let drawerEl = null;

export function mountWhyDrawer() {
  if (drawerEl) return drawerEl;

  drawerEl = document.createElement('div');
  drawerEl.id = 'why-drawer';
  drawerEl.innerHTML = `
    <style>
      #why-drawer {
        position: fixed; right: 18px; bottom: 18px; z-index: 9999;
        width: min(520px, 95vw); max-height: 80vh; overflow: hidden;
        background: rgba(12,18,28,0.96); border: 1px solid #1e2b3a; border-radius: 14px;
        color: #e6f0ff; font: 13px/1.45 system-ui, -apple-system, Segoe UI, Roboto, Arial;
        box-shadow: 0 18px 40px rgba(0,0,0,.35);
      }
      #why-drawer .hdr {
        display: flex; gap: 10px; align-items: center; justify-content: space-between;
        padding: 10px 12px; border-bottom: 1px solid #1e2b3a; background: #0d1420;
      }
      #why-drawer .hdr .title { font-weight: 700; font-size: 14px; color: #7de8ff; }
      #why-drawer .hdr .meta { opacity: .8; font-variant-numeric: tabular-nums; }
      #why-drawer .body { overflow: auto; max-height: calc(80vh - 102px); padding: 10px 12px; }
      #why-drawer .row {
        border: 1px solid #1e2b3a; border-radius: 10px; margin: 8px 0; padding: 8px 10px; background: #0b111b;
      }
      #why-drawer .row .head { display:flex; align-items:center; gap:10px; justify-content:space-between; }
      #why-drawer .row .name { font-weight: 700; letter-spacing: .2px; }
      #why-drawer .row .score { font-family: ui-monospace, SFMono-Regular, Consolas, Menlo, monospace; opacity: .9; }
      #why-drawer .bar {
        height: 6px; background: #112236; border-radius: 999px; overflow: hidden; margin: 6px 0 8px;
      }
      #why-drawer .bar > i { display:block; height:100%; width:0%; background: linear-gradient(90deg,#00e5ff,#16f0a7); }
      #why-drawer .why li { margin: 4px 0; opacity: .95; }
      #why-drawer .why { margin: 6px 0 2px 14px; padding-left: 8px; }
      #why-drawer .f { color:#9dc2ff; }
      #why-drawer .actions { display:flex; gap:8px; padding: 8px 12px; border-top:1px solid #1e2b3a; background:#0d1420; }
      #why-drawer button {
        background:#0f1b2a; color:#d8eeff; border:1px solid #1e2b3a; border-radius:10px; padding:6px 10px; font-weight:600; cursor:pointer;
      }
      #why-drawer .close { background:#132033; }
      #why-drawer .pill {
        font: 11px/1.6 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
        background:#102034; color:#8bdcff; padding:2px 8px; border-radius: 999px; border:1px solid #1e2b3a;
      }
    </style>
    <div class="hdr">
      <div class="title">Why this result?</div>
      <div class="meta"><span id="why-meta"></span></div>
    </div>
    <div class="body" id="why-body"></div>
    <div class="actions">
      <button id="why-export-csv">Export CSV</button>
      <button id="why-export-json">Export JSON</button>
      <button id="why-export-jsonl">Export JSONL</button>
      <div style="flex:1"></div>
      <button class="close" id="why-close">Close</button>
    </div>
  `;
  document.body.appendChild(drawerEl);

  drawerEl.querySelector('#why-close').onclick = () => drawerEl.remove();

  return drawerEl;
}

/**
 * Render the drawer with fused results.
 * @param {Object} data - { traits, report, global, scanMeta, evidences }
 * @param {Function} exporters - { toCSV(traits), toJSON(data), toJSONL(meta, traits, evidences) }
 */
export function showWhy(data, exporters = {}) {
  const { traits, report, global, scanMeta = {}, evidences = [] } = data || {};
  if (!traits || !report) throw new Error('showWhy: traits & report required');

  const root = mountWhyDrawer();

  // Header meta
  const metaEl = root.querySelector('#why-meta');
  metaEl.innerHTML = `
    <span class="pill">Global ${pct(global?.confidence ?? 0)}</span>
    <span class="pill">Score ${n1(global?.score ?? 0)}</span>
    ${scanMeta?.hand ? `<span class="pill">${esc(scanMeta.hand)} hand</span>` : ''}
    ${scanMeta?.id ? `<span class="pill">${esc(scanMeta.id)}</span>` : ''}
  `;

  // Body rows
  const body = root.querySelector('#why-body');
  body.innerHTML = '';
  for (const [name, t] of Object.entries(traits)) {
    const row = document.createElement('div');
    row.className = 'row';
    row.innerHTML = `
      <div class="head">
        <div class="name">${esc(name)}</div>
        <div class="score">score ${n1(t.score)} · conf ${pct(t.confidence)} · votes ${t.votes}</div>
      </div>
      <div class="bar"><i style="width:${Math.max(0, Math.min(100, t.score))}%"></i></div>
      <ul class="why">${(t.evidence || []).slice(0,5).map(e =>
        `<li><span class="f">${esc(e.id)}</span> (${n2(e.conf)}): ${esc(e.why || '')}</li>`
      ).join('')}</ul>
    `;
    body.appendChild(row);
  }

  // Export buttons
  const toCSV   = exporters.toCSV   || defaultToCSV;
  const toJSON  = exporters.toJSON  || defaultToJSON;
  const toJSONL = exporters.toJSONL || defaultToJSONL;

  root.querySelector('#why-export-csv').onclick  = () => download('palm_traits.csv', toCSV(traits));
  root.querySelector('#why-export-json').onclick = () => download('palm_report.json', toJSON({ traits, report, global, scanMeta, evidences }));
  root.querySelector('#why-export-jsonl').onclick= () => download('palm_scan.jsonl', toJSONL(scanMeta, traits, evidences));
}

//// Default exporters /////////////////////////////////////////////////////////

function defaultToCSV(traits) {
  const headers = Object.keys(traits);
  const scores  = headers.map(k => round(traits[k].score, 1));
  const confs   = headers.map(k => round(traits[k].confidence, 3));
  return [
    ['trait', ...headers].join(','),
    ['score', ...scores].join(','),
    ['confidence', ...confs].join(',')
  ].join('\n');
}

function defaultToJSON(obj) {
  return JSON.stringify(obj, null, 2);
}

function defaultToJSONL(meta, traits, evidences) {
  const rec = {
    id: meta?.id || null,
    hand: meta?.hand || null,
    timestamp: meta?.timestamp || Date.now(),
    traits: Object.fromEntries(Object.entries(traits).map(([k,v]) => [k, {score:round(v.score,1), confidence:round(v.confidence,3), votes:v.votes}])),
    evidences: (evidences||[]).map(e => ({ id:e.id, target:e.target, score:e.score, conf:round(e.conf,3), why:e.why }))
  };
  return JSON.stringify(rec);
}

//// Utils ////////////////////////////////////////////////////////////////////

function download(name, text) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
function esc(s=''){ return String(s).replace(/[&<>"]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m])); }
function pct(x){ return `${Math.round(Number(x||0)*100)}%`; }
function n1(x){ return (Math.round(Number(x||0)*10)/10).toFixed(1); }
function n2(x){ return (Math.round(Number(x||0)*100)/100).toFixed(2); }
function round(x,k=2){ const p=10**k; return Math.round(Number(x)*p)/p; }
