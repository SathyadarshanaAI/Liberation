// main.js — V17.5 Stable Perceptive Edition
import { startCam, capture } from "./camera.js";
import { analyzePalm } from "./brain.js";

document.addEventListener("DOMContentLoaded", () => {
  const status = document.getElementById("status");
  const reportBox = document.getElementById("reportBox");

  const aiBtn = document.createElement("button");
  aiBtn.textContent = "🧠 AI Analyze Palm";
  aiBtn.className = "analyzeBtn";
  document.body.appendChild(aiBtn);

  status.textContent = "🧠 Initializing AI Modules...";
  setTimeout(() => {
    status.textContent = "✅ AI Buddhi Ready for Palm Analysis";
  }, 1200);

  // === Camera Buttons ===
  document.getElementById("startCamLeft").onclick = () => startCam("left");
  document.getElementById("startCamRight").onclick = () => startCam("right");
  document.getElementById("captureLeft").onclick = () => capture("left");
  document.getElementById("captureRight").onclick = () => capture("right");

  // === AI Button Logic ===
  aiBtn.onclick = async () => { // 👈 make this async
    aiBtn.disabled = true;
    aiBtn.textContent = "🤖 Reading your palm...";
    reportBox.textContent = "AI Buddhi is perceiving energy lines...";

    try {
      // 👇 'await' ensures we get the final text, not a Promise
      const report = await analyzePalm("right", "canvasRight");

      reportBox.textContent = report; // show real Dharma report
      console.log("AI Buddhi report generated:", report);
    } catch (err) {
      console.error("AI analysis error:", err);
      reportBox.textContent = "⚠️ Error reading palm data.";
    }

    aiBtn.textContent = "🧠 AI Analyze Palm";
    aiBtn.disabled = false;
  };
});
