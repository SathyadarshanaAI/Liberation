// js/main.js
import { startCam, capture } from "./camera.js";
import { analyzePalm } from "./brain.js";
import { speak } from "./voice.js"; // 🆕 added voice import

document.addEventListener("DOMContentLoaded", () => {
  const status = document.getElementById("status");
  const reportBox = document.getElementById("reportBox");

  const aiBtn = document.createElement("button");
  aiBtn.textContent = "🧠 AI Analyze Palm";
  aiBtn.className = "analyzeBtn";
  document.body.appendChild(aiBtn);

  status.textContent = "🧘 Initializing AI Buddhi...";
  setTimeout(() => { status.textContent = "✅ Ready for Palm Analysis"; }, 1200);

  document.getElementById("startCamLeft").onclick = () => startCam("left");
  document.getElementById("startCamRight").onclick = () => startCam("right");
  document.getElementById("captureLeft").onclick = () => capture("left");
  document.getElementById("captureRight").onclick = () => capture("right");

  aiBtn.onclick = () => {
    aiBtn.disabled = true;
    aiBtn.textContent = "🤖 Reading energy lines...";
    reportBox.textContent = "🪷 Analyzing with Buddhi’s Dharma Insight...";
    setTimeout(() => {
      const report = analyzePalm();
      reportBox.textContent = report;
      speak(report, "en-US"); // 🗣️ Buddhi reads the report aloud
      aiBtn.disabled = false;
      aiBtn.textContent = "🧠 AI Analyze Palm";
    }, 2200);
  };
});
