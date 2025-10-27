export async function generatePalmReport(v, side) {
  const baseEnergy = (v.life.strength + v.heart.clarity + v.head.depth) * 33.3;
  const fate = v.fate.split
    ? "dual opportunities — transformation is near."
    : "steady destiny showing balanced karma.";

  // 🕉 karmic differentiation
  const karmic =
    side === "left"
      ? "This hand carries karmic memories from previous lives — lessons, vows, and blessings that shape your present path."
      : "This hand reveals your active life journey — choices, creation, and destiny unfolding in this lifetime.";

  return `
  <h3>${side === "left" ? "🌸" : "🌞"} AI RealScan Report (${side} hand)</h3>
  <p>${karmic}</p>
  <p>Your ${side === "left" ? "emotional" : "practical"} strength shows a ${v.life.curve} life line and a clear heart line, 
  revealing depth and ${side === "left" ? "spiritual intuition" : "conscious direction"}. 
  The head line shows steadiness and wisdom. 
  Your fate line shows ${fate}</p>
  <p>✨ <b>Energy Index:</b> ${baseEnergy.toFixed(2)}</p>
  <hr style="border:0;height:1px;background:#00e5ff30;">`;
}
