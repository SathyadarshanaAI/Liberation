 // modules/teachings.js
// Rule matcher for Sathyadarshana Palm Research.
// Inputs: (A) raw structures: { lines, mounts }   (B) numeric features: from features.js
// Rules: knowledge/teachings.json (see Step 1)
// Output: array of evidence objects suitable for fusion.

//// Public API /////////////////////////////////////////////////////////////////

/** Load teachings from JSON (v1.0 schema). */
export async function loadTeachings(url = './knowledge/teachings.json') {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) { console.warn('teachings.json not found:', res.status); return []; }
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

/**
 * Match rules to the given palm data.
 * @param {object} structures - { lines:{name:{poly,...}}, mounts:{...} }
 * @param {object} features   - { name:{len_norm, slope_deg, curvature, continuity, ...}, ... }
 * @param {Array} rules       - teachings array
 * @returns {Array} evidence  - [{ id, target, score, conf, why, rule }]
 */
export function matchRules(structures, features, rules) {
  const out = [];
  for (const rule of rules) {
    const targets = rule.applies_to?.length ? rule.applies_to : [null];
    for (const target of targets) {
      const ctx = buildContext(structures, features, target);
      if (!ctx) continue;

      const ok = applies(rule.pattern || {}, ctx);
      if (!ok) continue;

      const score = evalScore(rule, ctx);
      const why = buildWhy(rule, ctx);
      out.push({
        id: rule.id,
        target,
        score,
        conf: clamp(rule.confidence ?? 0.6, 0, 1),
        why,
        rule
      });
    }
  }
  return out;
}

//// Context & Pattern Evaluation /////////////////////////////////////////////

function buildContext(structures, features, target) {
  // For line-specific rules, require that line exists
  if (target) {
    const lineStruct = structures?.lines?.[target];
    const lineFeat   = features?.[target];
    if (!lineStruct || !lineFeat) return null;
    return { target, line: lineStruct, feat: lineFeat, mounts: structures?.mounts || {} };
  }
  // Global rules (rare); still provide mounts/aggregate access
  return { target: null, line: null, feat: null, mounts: structures?.mounts || {} };
}

/** Check whether rule.pattern matches the context. */
function applies(pattern, ctx) {
  // Empty pattern -> match everything (not recommended but allowed)
  if (!pattern || Object.keys(pattern).length === 0) return true;

  // Numeric gates on features
  if (!rangeOk(pattern.len_norm, ctx.feat?.len_norm)) return false;
  if (!rangeOk(pattern.slope_deg, ctx.feat?.slope_deg)) return false;
  if (!rangeOk(pattern.curvature, ctx.feat?.curvature)) return false;
  if (!rangeOk(pattern.continuity, ctx.feat?.continuity)) return false;

  // Qualitative flags
  if (pattern.depth && !qualEquals(pattern.depth, ctx.line?.depth)) return false;
  if (pattern.continuity === 'clear' && !(ctx.feat?.continuity >= 0.9)) return false;

  // Origin / towards / mount-related
  if (pattern.origin && !originIs(pattern.origin, ctx.line)) return false;
  if (pattern.towards && !towardsMount(pattern.towards, ctx.line)) return false;

  // Breaks / forks / crosses / shape / count
  if (defined(pattern.breaks) && !countAtLeast(ctx.line?.breaks?.length, pattern.breaks)) return false;
  if (defined(pattern.count)  && !countEquals(ctx.line?.count ?? estimateCount(ctx.line), pattern.count)) return false;
  if (pattern.forks && !forksMatch(pattern.forks, ctx.line)) return false;
  if (pattern.crosses && !crossesMatch(pattern.crosses, ctx.line)) return false;
  if (pattern.shape && !shapeIs(pattern.shape, ctx.line)) return false;

  // Positional qualifiers (early/middle/end)
  if (pattern.pos && !posMatch(pattern.pos, ctx.line)) return false;
  if (pattern.at  && !posMatch(pattern.at,  ctx.line)) return false;

  return true;
}

//// Scoring ///////////////////////////////////////////////////////////////////

/** Compute a rule score. Baseline = +10 if matched, with feature-aware tweaks. */
function evalScore(rule, ctx) {
  let s = 10;

  // Depth/continuity adjustments if present
  if (ctx.line?.depth) {
    s += weightDepth(ctx.line.depth);
  }
  if (defined(ctx.feat?.continuity)) {
    s += mapRange(ctx.feat.continuity, 0, 1, -4, +6);
  }

  // Optional explicit strength_rules in rule
  const sr = rule.strength_rules || [];
  for (const r of sr) {
    if (!r.if) continue;
    if (r.if.depth && !qualEquals(r.if.depth, ctx.line?.depth)) continue;
    if (defined(r.if.continuity) && !rangeOk(r.if.continuity, ctx.feat?.continuity)) continue;
    if (defined(r.if.len_norm) && !rangeOk(r.if.len_norm, ctx.feat?.len_norm)) continue;
    s += Number(r.score || 0);
  }

  // Clamp and round
  return Math.round(clamp(s, -20, 40));
}

function weightDepth(depth) {
  switch (String(depth).toLowerCase()) {
    case 'deep': return +6;
    case 'medium': return +2;
    case 'shallow': return -4;
    default: return 0;
  }
}

//// Pattern helpers ///////////////////////////////////////////////////////////

function rangeOk(spec, value) {
  if (!defined(spec)) return true;
  if (!defined(value)) return false;
  if (typeof spec === 'number') return value === spec;
  if (typeof spec === 'string') {
    // Aliases like "deep"/"clear" are handled elsewhere
    return true;
  }
  if (typeof spec === 'object') {
    const min = defined(spec.min) ? spec.min : -Infinity;
    const max = defined(spec.max) ? spec.max : +Infinity;
    return value >= min && value <= max;
  }
  return false;
}

function qualEquals(expect, got) {
  if (!defined(expect)) return true;
  if (!defined(got)) return false;
  return String(expect).toLowerCase() === String(got).toLowerCase();
}

function originIs(mount, line) {
  // expects line.origin === mount (if extractor sets it)
  if (!line) return false;
  if (line.origin) return String(line.origin).toLowerCase() === String(mount).toLowerCase();
  // fallback: estimate from first point quadrant (optional)
  return false;
}

function towardsMount(mount, line) {
  // expects line.towards === mount OR a fork towards target mount
  if (!line) return false;
  if (line.towards) return String(line.towards).toLowerCase() === String(mount).toLowerCase();
  if (Array.isArray(line.forks)) {
    return line.forks.some(f => String(f.to).toLowerCase() === String(mount).toLowerCase());
  }
  return false;
}

function forksMatch(spec, line) {
  if (!Array.isArray(spec)) return true;
  if (!Array.isArray(line?.forks)) return false;
  // Accept if EVERY requested constraint is satisfied by ANY fork
  return spec.every(req => line.forks.some(f => forkSatisfies(req, f)));
}
function forkSatisfies(req, f) {
  if (defined(req.count_min) && !countAtLeast(f.count ?? 1, req.count_min)) return false;
  if (req.towards && String(f.to).toLowerCase() !== String(req.towards).toLowerCase()) return false;
  if (req.pos && !posApprox(req.pos, f.pos)) return false;
  return true;
}

function crossesMatch(spec, line) {
  if (!Array.isArray(spec)) return true;
  if (!Array.isArray(line?.crosses)) return false;
  return spec.every(req => line.crosses.some(c => crossSatisfies(req, c)));
}
function crossSatisfies(req, c) {
  if (req.mount && String(c.mount).toLowerCase() !== String(req.mount).toLowerCase()) return false;
  if (req.pos && !posApprox(req.pos, c.pos)) return false;
  return true;
}

function shapeIs(expect, line) {
  return qualEquals(expect, line?.shape);
}

function posMatch(where, line) {
  // where: "early" | "middle" | "end"
  // line.breaks or forks may carry a normalized position 0..1
  const pos = normPos(line);
  if (!defined(pos)) return false;
  return posApprox(where, pos);
}
function posApprox(where, p) {
  switch (String(where).toLowerCase()) {
    case 'early':  return p <= 0.33;
    case 'middle': return p > 0.33 && p < 0.66;
    case 'end':    return p >= 0.66;
    default:       return false;
  }
}

// Fallback: if no explicit pos, estimate from main poly end position relevance (optional)
function normPos(line) {
  // Prefer first break/fork/cross pos if available
  const p =
    line?.breaks?.[0] ??
    line?.forks?.[0]?.pos ??
    line?.crosses?.[0]?.pos;
  return defined(p) ? clamp(Number(p), 0, 1) : undefined;
}

// Count helpers
function estimateCount(line) {
  // For marriage lines etc., you may set line.count upstream.
  return line?.count ?? (line?.forks?.length || 0);
}
function countAtLeast(value, min) {
  if (!defined(value)) return false;
  return Number(value) >= Number(min);
}
function countEquals(value, n) {
  if (!defined(value)) return false;
  return Number(value) === Number(n);
}

//// Why-text /////////////////////////////////////////////////////////////////

function buildWhy(rule, ctx) {
  // prefer explicit text on rule; else synthesize from ids and essentials
  if (rule.explanations?.short) return rule.explanations.short;
  const bits = [];
  if (rule.pattern?.origin) bits.push(`origin=${rule.pattern.origin}`);
  if (rule.pattern?.towards) bits.push(`towards=${rule.pattern.towards}`);
  if (defined(ctx.feat?.continuity)) bits.push(`continuity=${ctx.feat.continuity.toFixed(2)}`);
  if (defined(ctx.feat?.len_norm))   bits.push(`len_norm=${ctx.feat.len_norm.toFixed(2)}`);
  return `${rule.id}${bits.length ? ' (' + bits.join(', ') + ')' : ''}`;
}

//// Utils ////////////////////////////////////////////////////////////////////

function defined(x) { return x !== undefined && x !== null; }
function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
function mapRange(v, inMin, inMax, outMin, outMax) {
  if (!defined(v)) return 0;
  const t = (v - inMin) / (inMax - inMin);
  return outMin + clamp(t, 0, 1) * (outMax - outMin);
}
