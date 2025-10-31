// 🕉️ Sathyadarshana Quantum Palm Analyzer · V15.3 True Synchrony Edition
// main.js — Complete DOM-safe Build with Aura + Voice + Dharma Integration

import { startCam, capture } from "./camera.js";
import { drawPalm } from "./drawPalm.js";
import { drawAura } from "./aura.js";
import { speak } from "./voice.js";
import { describeLineDhamma, activateDharmaMode } from "./dharmaMode.js";

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

  if (!startLeft || !capLeft || !startRight || !capRight) {
    console.error("❌ Camera buttons not found");
    return;
  }

  // === LEFT HAND ===
  startLeft.onclick = () => startCam("left", statusEl);
  capLeft.onclick = () => {
    capture("left", ctx => {
      drawPalm(ctx);
      drawAura(document.getElementById("canvasLeft"), "#00e5ff");
      const msg = describeLineDhamma("Life");
      reportEl.innerHTML = `🧠 Left hand captured.<br>${msg}`;
      speak("Left hand captured. AI Buddhi analyzing your life line.");
    });
  };

  // === RIGHT HAND ===
  startRight.onclick = () => startCam("right", statusEl);
  capRight.onclick = () => {
    capture("right", ctx => {
      drawPalm(ctx);
      drawAura(document.getElementById("canvasRight"), "#FFD700");
      const msg = describeLineDhamma("Fate");
      reportEl.innerHTML = `✨ Right hand captured.<br>${msg}`;
      speak("Right hand captured. AI Buddhi analyzing your destiny.");
      activateDharmaMode(reportEl);
    });
  };

  // === INITIAL STATUS ===
  statusEl.textContent = "✅ System initialized. Ready for Dharma Scan.";
  speak("Welcome to Sathyadarshana Quantum Palm Analyzer True Synchrony Edition. Please begin your Dharma scan.");

  // === Subtle animated feedback ===
  let dots = 0;
  setInterval(() => {
    dots = (dots + 1) % 4;
    statusEl.textContent = "AI Buddhi preparing Dharma vision" + ".".repeat(dots);
  }, 1800);

  console.log("✅ Palm Analyzer initialized successfully");
}
