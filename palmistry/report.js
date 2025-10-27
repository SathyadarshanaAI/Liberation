import { speak } from "./voice.js";

export async function generatePalmReport(v, side) {
  const energy = (v.life.strength + v.heart.clarity + v.head.depth) * 33.3;
  const lang = window.currentLang || "en";

  const message = side === "left"
    ? "Your left hand carries past karmic memories. Strong heart line and broad life line show deep spiritual heritage."
    : "Your right hand reveals present and future path. Clear lines show conscious direction and balanced karma.";

  // 🧠 Voice Summary in chosen language
  speak(message, lang);

  return `
  <h3>${side === "left" ? "🌸" : "🌞"} AI RealScan Report (${side} hand)</h3>
  <p>${message}</p>
  <p>✨ <b>Energy Index:</b> ${energy.toFixed(2)}</p>
  <hr style="border:0;height:1px;background:#00e5ff30;">`;
}
