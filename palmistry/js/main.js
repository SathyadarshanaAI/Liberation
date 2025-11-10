// =====================================================
// 🕉️ Sathyadarshana Quantum Palm Analyzer · V28.0
// Core Controller (main.js)
// =====================================================

import { initApp } from "./app.js";
import { initAI } from "./aiCore.js";
import { runPalmPipeline } from "./palmPipeline.js";
import { speakSinhala } from "./voice.js";

document.addEventListener("DOMContentLoaded", async () => {
  console.log("🕉️ Initializing Sathyadarshana Quantum Palm Analyzer...");

  // 1️⃣ Initialize AI Core
  await initAI();

  // 2️⃣ Initialize App + Camera controls
  const appCtx = await initApp();

  // 3️⃣ Bind Analyze button
  document.querySelectorAll("[id^='analyze']").forEach(btn => {
    btn.addEventListener("click", async e => {
      const side = e.target.id.includes("Left") ? "left" : "right";
      const report = await runPalmPipeline(side, appCtx[side]);
      speakSinhala(report.voice);
    });
  });

  document.getElementById("status").textContent = "✨ System Ready for Palm Analysis!";
});
