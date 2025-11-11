import { initApp } from "./app.js";
import { initAI } from "./aiCore.js";
import { runPalmPipeline } from "./palmPipeline.js";
import { speakSinhala } from "./voice.js";

document.addEventListener("DOMContentLoaded", async () => {
  console.log("🕉️ Initializing Sathyadarshana Quantum Palm Analyzer...");
  try {
    await initAI(); // OpenCV and tf ready
    const appCtx = await initApp(); // Camera, canvas, ctx

    // Analyze Palm click handler (left/right)
    document.querySelectorAll("[id^='analyze']").forEach(btn => {
      btn.addEventListener("click", async e => {
        const side = e.target.id.includes("Left") ? "left" : "right";
        const result = await runPalmPipeline(side, appCtx[side]);
        speakSinhala(result.voice); // Voice output
      });
    });

    document.getElementById("status").textContent = "✨ System Ready for Palm Analysis!";
  } catch (err) {
    console.error("💥 Initialization failed:", err);
    document.getElementById("status").textContent = "💢 Initialization Error: " + err.message;
  }
});
