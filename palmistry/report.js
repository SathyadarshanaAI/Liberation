import { speak } from "./voice.js";

export async function generatePalmReport(v, side) {
  const baseEnergy = (v.life.strength + v.heart.clarity + v.head.depth) * 33.3;
  const fate = v.fate.split
    ? "dual opportunities — transformation is near."
    : "steady destiny showing balanced karma.";

  const karmic =
    side === "left"
      ? "This hand carries karmic memories from previous lives — lessons, vows, and blessings that shape your present path."
      : "This hand reveals your active life journey — choices, creation, and destiny unfolding in this lifetime.";

  const reportText = `Your ${side === "left" ? "past karmic" : "current life"} hand shows a clear heart line and a strong life line. 
  The head line reveals calm insight. Your fate line ${fate}`;

  // 🧠 voice summary (Sinhala version can be switched later)
  speak(`AI report for your ${side} hand. ${reportText}`, "en");

  return `
  <h3>${side === "left" ? "🌸" : "🌞"} AI RealScan Report (${side} hand)</h3>
  <p>${karmic}</p>
  <p>${reportText}</p>
  <p>✨ <b>Energy Index:</b> ${baseEnergy.toFixed(2)}</p>
  <hr style="border:0;height:1px;background:#00e5ff30;">`;
}
