/* ---------------------------------------------------------
   KARMA ANALYSIS ENGINE
----------------------------------------------------------*/

export function karmaAnalysis(lines) {
  const karmaScore = (
    lines.life +
    lines.head +
    lines.heart +
    lines.manikanda
  ) / 4;

  return `
KARMA FLOW INDEX: ${karmaScore}
Interpretation: Deep spiritual resonance active.
  `;
}
