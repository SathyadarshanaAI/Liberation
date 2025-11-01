// 🕉️ Sathyadarshana Quantum Palm Analyzer · V15.4 Dharma Synchrony Clean Build
import { startCam, capture } from "./camera.js";
import { drawPalm } from "./drawPalm.js";
import { drawAura } from "./aura.js";

document.addEventListener("DOMContentLoaded", () => {
  initPalmAnalyzer();
});

function initPalmAnalyzer() {
  const startLeft = document.getElementById("startCamLeft");
  const startRight = document.getElementById("startCamRight");
  const capLeft = document.getElementById("captureLeft");
  const capRight = document.getElementById("captureRight");
  const statusEl = document.getElementById("status");
  const reportEl = document.getElementById("report");

  startLeft.onclick = () => startCam("left", statusEl);
  startRight.onclick = () => startCam("right", statusEl);

  capLeft.onclick = () => {
    capture("left", ctx => {
      drawPalm(document.getElementById("canvasLeftLines").getContext("2d"));
      drawAura(document.getElementById("canvasLeftAura"), "#00e5ff");
      reportEl.innerHTML = "🧠 Left hand captured — Life line of awareness illuminated.";
    });
  };

  capRight.onclick = () => {
    capture("right", ctx => {
      drawPalm(document.getElementById("canvasRightLines").getContext("2d"));
      drawAura(document.getElementById("canvasRightAura"), "#FFD700");
      reportEl.innerHTML = "✨ Right hand captured — Fate line of Dharma awakening.";
    });
  };

  statusEl.textContent = "✅ System initialized. Ready for Dharma Scan.";
  console.log("✅ Palm Analyzer initialized successfully");
}
