// main.js — V17.5 Stable Perceptive Edition
import { startCam, capture } from "./camera.js";
import { analyzePalm } from "./brain.js";

document.addEventListener("DOMContentLoaded", () => {
  const status = document.getElementById("status");
  const reportBox = document.getElementById("reportBox");

  // === Create AI Analyze button dynamically ===
  const aiBtn = document.createElement("button");
  aiBtn.textContent = "🧠 AI Analyze Palm";
  aiBtn.className = "analyzeBtn";
  document.body.appendChild(aiBtn);

  // === Boot message ===
  status.textContent = "🧠 Initializing AI Modules...";
  setTimeout(() => {
    status.textContent = "✅ AI Buddhi Ready for Palm Analysis";
  }, 1200);

  // === Camera Buttons ===
  document.getElementById("startCamLeft").onclick  = () => startCam("left");
  document.getElementById("startCamRight").onclick = () => startCam("right");
  document.getElementById("captureLeft").onclick   = () => capture("left");
  document.getElementById("captureRight").onclick  = () => capture("right");

  // === AI Analyze Button Logic ===
  aiBtn.onclick = async () => {
    aiBtn.disabled = true;
    aiBtn.textContent = "🤖 Reading your palm...";
    reportBox.textContent = "AI Buddhi is perceiving energy lines and vibrations ...";

    // glowing effect
    reportBox.style.textShadow = "0 0 12px #16f0a7";

    try {
      // analyze right hand by default
      const report = await analyzePalm("right", "canvasRight");

      // display Dharma-style result
      reportBox.innerHTML = `<p>${report}</p>`;
      console.log("AI Buddhi report generated →", report);
    } catch (err) {
      console.error("AI analysis error:", err);
      reportBox.textContent = "⚠️ Error reading palm data – check camera or reload page.";
    }

    // reset visuals
    aiBtn.textContent = "🧠 AI Analyze Palm";
    aiBtn.disabled = false;
    setTimeout(() => (reportBox.style.textShadow = "none"), 2000);
  };
});
