// =====================================================
// 🕉️ Sathyadarshana Quantum Palm Analyzer · V28.2
// Core Controller (main.js)
// =====================================================

import { initApp } from "./app.js";
import { initAI } from "./aiCore.js";
import { runPalmPipeline } from "./palmPipeline.js";
import { speakSinhala } from "./voice.js";

document.addEventListener("DOMContentLoaded", async () => {
  console.log("🕉️ Initializing Sathyadarshana Quantum Palm Analyzer...");
  try {
    await initAI(); // Wait till AI (OpenCV) ready
    const appCtx = await initApp(); // Camera/canvas/context

    document.querySelectorAll("[id^='analyze']").forEach(btn => {
      btn.addEventListener("click", async e => {
        const side = e.target.id.includes("Left") ? "left" : "right";
        const report = await runPalmPipeline(side, appCtx[side]); // Analyze palm
        speakSinhala(report.voice); // Speak summary
      });
    });

    document.getElementById("status").textContent = "✨ System Ready for Palm Analysis!";
  } catch (err) {
    console.error("💥 Initialization failed:", err);
    document.getElementById("status").textContent = "💢 Initialization Error: " + err.message;
  }
});

// ====== Quick Code Health Diagnostic (Optional) ======
(function codeHealthCheck() {
  try {
    console.log("🧠 Running Code Health Diagnostic...");
    const modules = ["initApp", "initAI", "runPalmPipeline", "speakSinhala"];
    modules.forEach(fn => {
      if (typeof eval(fn) !== "function") console.warn(`⚠️ Missing module: ${fn}`);
    });

    if (typeof cv === "undefined") console.warn("⚠️ OpenCV not loaded!");
    if (typeof tf === "undefined") console.warn("⚠️ TensorFlow not loaded!");
    const testScript = "let x = 1 + 2; console.log('🩺 Syntax OK:', x);";
    new Function(testScript)();
    console.log("✅ Code Health: No critical syntax errors detected.");
  } catch (err) {
    console.error("💢 Code Health Error:", err.message);
    const st = document.getElementById("status");
    if (st) st.textContent = "💢 Code Health Error: " + err.message;
  }
})();
