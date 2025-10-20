// modules/fusion.js
// Evidence fusion → trait scores + confidence + explainability
// Input: evidences = [{ id, target, score, conf, why, rule }, ...]
// Output: { traits:{...}, global:{score, confidence}, report:{...} }

//// Public API /////////////////////////////////////////////////////////////////

/**
 * Fuse evidences into trait scores.
 * @param {Array} evidences  Evidence objects from matchRules()
 * @param {Object} opts      {traitMap, damping, cap, bias, minVotes}
 * @returns {Object}         { traits, global, report }
 */
export function fuseEvidences(evidences = [], opts = {}) {
  const traitMap = opts.traitMap || defaultTraitMap();
  const damping  = number(opts.damping, 0.75);   // reduces overconfident stacking
  const cap      = number(opts.cap, 100);        // max trait score
  const bias     = number(opts.bias, 50);        // neutral midpoint (0..100)
  const minVotes = number(opts.minVotes, 1);

  // 1) route evidences → traits
  const routed = routeToTraits(evidences, traitMap);

  // 2) aggregate each trait
  const traits = {};
  for (const [trait, items] of Object.entries(routed)) {
    if (!items.length || items.length < minVotes) {
      traits[trait] = { score: bias, confidence: 0, votes: 0, evidence: [] };
      continue;
    }
    const { score, confidence } = aggregate(items, { damping, bias, cap });
    traits[trait] = { score, confidence, votes: items.length, evidence: items };
  }

  // 3) global summary
  const global = globalSummary(traits);

  // 4) explanation report
  const report = buildReport(traits);

  return { traits, global, report };
}

/** Export a compact CSV of trait scores (one row). */
export function traitsToCSV(traitsObj) {
  const headers = Object.keys(traitsObj);
  const scores  = headers.map(k => round(traitsObj[k].score, 1));
  const confs   = headers.map(k => round(traitsObj[k].confidence, 3));
  return [
    ['trait', ...headers].join(','),
    ['score', ...scores].join(','),
    ['confidence', ...confs].join(',')
  ].join('\n');
}

/** Minimal JSONL line for a single scan. */
export function jsonlForScan(scanMeta = {}, traitsObj = {}, evidences = []) {
  return JSON.stringify({
    id: scanMeta.id || null,
    hand: scanMeta.hand || null,
    timestamp: scanMeta.timestamp || Date.now(),
    traits: Object.fromEntries(
      Object.entries(traitsObj).map(([k, v]) => [k, { score: v.score, confidence: v.confidence, votes: v.votes }])
    ),
    evidences: evidences.map(e => ({ id: e.id, target: e.target, score: e.score, conf: e.conf, why: e.why }))
  });
}

//// Internals /////////////////////////////////////////////////////////////////

function routeToTraits(evidences, traitMap) {
  const routed = Object.fromEntries(Object.keys(traitMap).map(t => [t, []]));
  for (const ev of evidences) {
    const traits = mapEvidenceToTraits(ev, traitMap);
    for (const t of traits) routed[t].push(ev);
  }
  return routed;
}

function mapEvidenceToTraits(ev, traitMap) {
  const out = [];
  for (const [trait, spec] of Object.entries(traitMap)) {
    // by rule id
    if (spec.rules && spec.rules.has(ev.id)) out.push(trait);
    // by line target
    if (spec.targets && ev.target && spec.targets.has(ev.target)) out.push(trait);
    // by category (future-friendly)
    if (spec.categories && ev.rule?.category && spec.categories.has(ev.rule.category)) out.push(trait);
  }
  return [...new Set(out)];
}

function aggregate(items, { damping, bias, cap }) {
  // Weighted sum with (score * conf), then damp toward bias to avoid runaway
  // scores; then clamp 0..cap. Confidence = 1 - Π(1-conf_i) (noisy-OR).
  let num = 0, den = 0;
  let confAgg = 0;
  let noisyOR = 1;
  for (const it of items) {
    const w = clamp(number(it.conf, 0.6), 0, 1);
    num += number(it.score, 0) * w;
    den += w;
    noisyOR *= (1 - w);
  }
  const base = den > 0 ? num / den : bias;
  const damped = bias + (base - bias) * damping;
  const score = clamp(damped, 0, cap);

  const confidence = clamp(1 - noisyOR, 0, 1);
  return { score, confidence };
}

function globalSummary(traits) {
  const arr = Object.values(traits);
  if (!arr.length) return { score: 50, confidence: 0 };
  const score = average(arr.map(x => x.score));
  const confidence = average(arr.map(x => x.confidence));
  return { score: round(score, 1), confidence: round(confidence, 3) };
}

export function buildReport(traits) {
  const rows = [];
  for (const [name, t] of Object.entries(traits)) {
    const topWhy = (t.evidence || [])
      .slice() // clone
      .sort((a, b) => (b.conf * Math.abs(b.score)) - (a.conf * Math.abs(a.score)))
      .slice(0, 5)
      .map(e => `• ${e.id} (${round(e.conf, 2)}): ${e.why}`);
    rows.push({
      trait: name,
      score: round(t.score, 1),
      confidence: round(t.confidence, 3),
      votes: t.votes,
      why: topWhy
    });
  }
  return {
    summary: `Traits=${rows.length}`,
    rows
  };
}

//// Defaults /////////////////////////////////////////////////////////////////

/**
 * Default trait map (edit freely).
 * Each trait selects evidences by rule ids, target lines, or categories.
 */
export function defaultTraitMap() {
  return {
    emotion: {
      rules: new Set(['heart.fork_up_jupiter', 'heart.break_mid']),
      targets: new Set(['heart'])
    },
    cognition: {
      rules: new Set(['head.crosses_saturn']),
      targets: new Set(['head'])
    },
    vitality: {
      rules: new Set(['life.fork_end', 'life.break_early']),
      targets: new Set(['life'])
    },
    vocation: {
      rules: new Set(['fate.from_luna', 'sun.deep_clear']),
      targets: new Set(['fate', 'sun'])
    },
    wellness: {
      rules: new Set(['health.chain']),
      targets: new Set(['health'])
    },
    relationships: {
      rules: new Set(['marriage.two_lines']),
      targets: new Set(['marriage'])
    },
    intuition: {
      rules: new Set(['manikanda.curved_up']),
      targets: new Set(['manikanda'])
    }
  };
}

//// Utils ////////////////////////////////////////////////////////////////////

function number(x, d = 0) { const n = Number(x); return Number.isFinite(n) ? n : d; }
function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
function average(arr) { return arr.length ? arr.reduce((s, v) => s + v, 0) / arr.length : 0; }
function round(x, k = 2) { const p = 10 ** k; return Math.round(x * p) / p; }
