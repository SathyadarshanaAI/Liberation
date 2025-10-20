// evaluation/metrics.js — evaluate AI predictions vs golden cases
// © Sathyadarshana Palm Research Core 2025

/**
 * Calculate precision, recall, and F1-score for line detection / meanings.
 * @param {Object[]} predictions - [{id, label, score}]
 * @param {Object[]} gold - [{id, label}]
 */
export function evaluate(predictions, gold) {
  const tp = predictions.filter(p =>
    gold.find(g => g.id === p.id && g.label === p.label)
  ).length;
  const fp = predictions.filter(p =>
    !gold.find(g => g.id === p.id && g.label === p.label)
  ).length;
  const fn = gold.filter(g =>
    !predictions.find(p => p.id === g.id && p.label === g.label)
  ).length;

  const precision = tp / (tp + fp || 1);
  const recall = tp / (tp + fn || 1);
  const f1 = (2 * precision * recall) / (precision + recall || 1);

  return { tp, fp, fn, precision, recall, f1 };
}

/**
 * Agreement metric for qualitative meaning texts.
 * Uses cosine similarity (simplified) between embeddings or word overlap.
 */
export function meaningAgreement(predText, goldText) {
  const p = new Set(predText.toLowerCase().split(/\W+/));
  const g = new Set(goldText.toLowerCase().split(/\W+/));
  const inter = [...p].filter(x => g.has(x)).length;
  const union = new Set([...p, ...g]).size;
  return inter / (union || 1);
}

/**
 * Evaluate multiple lines data structure
 */
export function evaluatePalm(predPalm, goldPalm) {
  const lines = Object.keys(goldPalm.lines);
  const results = {};
  for (const line of lines) {
    const pred = predPalm.lines[line];
    const gold = goldPalm.lines[line];
    if (pred && gold) {
      results[line] = meaningAgreement(pred.meaning || "", gold.meaning || "");
    }
  }
  return results;
}
