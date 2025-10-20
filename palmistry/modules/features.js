// modules/features.js
// Core palm line feature extractor for Sathyadarshana Palm Research System.
// Converts polylines into quantitative geometric descriptors.

export function extractAllFeatures(lines) {
  const result = {};
  for (const [name, data] of Object.entries(lines)) {
    if (!data || !Array.isArray(data.poly) || data.poly.length < 2) continue;
    result[name] = lineMetrics(data.poly);
  }
  return result;
}

/** Compute key metrics for a single line */
export function lineMetrics(poly) {
  const len = polylineLength(poly);
  const slope = slopeDeg(poly);
  const curvature = avgCurvature(poly);
  const continuity = continuityScore(poly);
  return {
    len_norm: normalizeLength(len),
    slope_deg: slope,
    curvature,
    continuity
  };
}

/** Total Euclidean length of the polyline */
export function polylineLength(poly) {
  let L = 0;
  for (let i = 1; i < poly.length; i++) {
    const dx = poly[i][0] - poly[i - 1][0];
    const dy = poly[i][1] - poly[i - 1][1];
    L += Math.hypot(dx, dy);
  }
  return L;
}

/** Overall slope in degrees (start → end) */
export function slopeDeg(poly) {
  const start = poly[0], end = poly.at(-1);
  return Math.atan2(end[1] - start[1], end[0] - start[0]) * 180 / Math.PI;
}

/** Approximate average curvature using 3-point segments */
export function avgCurvature(poly) {
  if (poly.length < 3) return 0;
  let total = 0, count = 0;
  for (let i = 1; i < poly.length - 1; i++) {
    const a = poly[i - 1], b = poly[i], c = poly[i + 1];
    const ang1 = Math.atan2(b[1] - a[1], b[0] - a[0]);
    const ang2 = Math.atan2(c[1] - b[1], c[0] - b[0]);
    let delta = ang2 - ang1;
    while (delta > Math.PI) delta -= 2 * Math.PI;
    while (delta < -Math.PI) delta += 2 * Math.PI;
    total += Math.abs(delta);
    count++;
  }
  return (total / count) * (180 / Math.PI);
}

/** Continuity score (0–1) based on gap distribution */
export function continuityScore(poly, gapThreshold = 12) {
  let gaps = 0;
  for (let i = 1; i < poly.length; i++) {
    const d = Math.hypot(poly[i][0] - poly[i - 1][0], poly[i][1] - poly[i - 1][1]);
    if (d > gapThreshold) gaps++;
  }
  const continuity = 1 - Math.min(1, gaps / (poly.length / 3));
  return Number(continuity.toFixed(3));
}

/** Normalize length relative to expected palm width (~600 px reference) */
export function normalizeLength(len, reference = 600) {
  return Number(Math.min(1, len / reference).toFixed(3));
}
