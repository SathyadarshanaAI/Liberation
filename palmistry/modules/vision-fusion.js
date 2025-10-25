// modules/vision-fusion.js — V11.0 AI Wisdom Fusion Engine
// © 2025 Sathyadarshana Research Core

import { analyzePalm } from "./vision.js";
import { emit } from "./bus.js";

// 🌌 Combine Vision + AI Wisdom logic
export async function generateWisdomReport() {
  emit("fusion:start", { msg: "Initiating dual-hand AI wisdom analysis..." });

  const leftCanvas = document.getElementById("canvasLeft");
  const rightCanvas = document.getElementById("canvasRight");

  const leftVision = await analyzePalm(leftCanvas);
  const rightVision = await analyzePalm(rightCanvas);

  // Combine results
  const linesTotal = (leftVision.linesDetected || 0) + (rightVision.linesDetected || 0);

  const wisdom = `
🖐️ **AI Wisdom Fusion Report**
───────────────────────────────────────────────
Left Hand (Past Life – Karma Imprint)
${summarize(leftVision)}

Right Hand (Present Life – Dharma Expression)
${summarize(rightVision)}

✨ Fusion Insight:
Your left palm carries karmic echoes of patience and spiritual resilience.
Your right palm reflects action, transformation, and the will to manifest divine purpose.
Together they form the circle of evolution — from remembrance to realization.

🧬 Total Lines Detected: ${linesTotal}
🕒 ${new Date().toLocaleString()}
`;

  emit("fusion:done", { msg: "Wisdom report ready" });
  return wisdom;
}

// summarize interpretation text
function summarize(v) {
  if (!v || !v.interpretation) return "No visible patterns detected.";
  return v.interpretation.map(x => `• ${x.name}: ${x.meaning}`).join("\n");
}
