export async function generatePalmReport(v, side) {
  const tone = side === "left" ? "emotionally intelligent" : "logically disciplined";
  const energy = (v.life.strength + v.heart.clarity + v.head.depth) * 33.3;
  const fateText = v.fate.split
    ? "Your fate line shows dual opportunities — transformation is near."
    : "A steady fate line indicates grounded progress.";
  return `
  <h3>🪷 AI RealScan Report (${side} hand)</h3>
  <p>Your ${tone} side shows a ${v.life.curve} life line and a clear heart line,
  revealing strength and depth of feeling. The head line shows insight and steadiness.
  ${fateText}</p>
  <p>✨ <b>Energy Index:</b> ${energy.toFixed(2)}</p>`;
}
