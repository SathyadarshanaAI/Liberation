import { speak } from "./voice.js";

export async function generatePalmReport(v, side) {
  const lang = window.currentLang || "en";
  const energy = (v.life.strength + v.heart.clarity + v.head.depth) * 33.3;
  const fate = v.fate.split
    ? "dual opportunities — transformation is near."
    : "steady destiny showing balanced karma.";

  const karmic =
    side === "left"
      ? "This hand carries karmic memories from previous lives — lessons, vows, and blessings that shape your present path."
      : "This hand reveals your active life journey — choices, creation, and destiny unfolding in this lifetime.";

  const text = `
  ${side === "left" ? "🌸 Past Life Insight" : "🌞 Present & Future Path"}
  ${karmic}
  Life line steady, Heart line deep, Fate line shows ${fate}
  Energy Index: ${energy.toFixed(2)}
  `;

  speak(text, lang);

  return `
  <h3>${side === "left" ? "🌸" : "🌞"} AI RealScan Report (${side} hand)</h3>
  <p>${text}</p>
  <p><button class="pdfBtn" onclick="exportPalmPDF('${side}')">📜 Save PDF</button></p>
  <hr style="border:0;height:1px;background:#00e5ff30;">`;
}
