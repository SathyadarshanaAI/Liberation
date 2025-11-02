// main.js — V17.8 Palm Visualization Edition
import { startCam, capture } from "./camera.js";
import { analyzePalm } from "./brain.js";
import { drawPalm } from "./lines.js";
import { paintPalmLines } from "./paintLayer.js";  // ✨ AI paint layer

// 🔊 Voice system (AI Buddhi speaking)
function speak(text) {
  const synth = window.speechSynthesis;
  if (!synth) return;
  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = "en-US";
  msg.rate = 1;
  msg.pitch = 1;
  synth.cancel();
  synth.speak(msg);
}

// 🔒 Lock animation overlay
function lockAnimation(canvas) {
  const overlay = document.createElement("div");
  overlay.className = "lockOverlay";
  overlay.textContent = "🔒 Captured — analyzing...";
  canvas.parentElement.style.position = "relative";
  canvas.parentElement.appendChild(overlay);
  setTimeout(() => overlay.remove(), 1800);
}

// 🌸 Boot logic
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
  document.getElementById("startCamLeft").onclick = () => startCam("left");
  document.getElementById("startCamRight").onclick = () => startCam("right");

  // === Capture Buttons (with visualization + animation) ===
  document.getElementById("captureLeft").onclick = async () => {
    capture("left");
    const canvas = document.getElementById("canvasLeft");
    const ctx = canvas.getContext("2d");
    await paintPalmLines(ctx);   // 🌈 Real AI surface paint
    drawPalm(ctx);               // 🪷 Neon labeled overlay
    lockAnimation(canvas);
  };

  document.getElementById("captureRight").onclick = async () => {
    capture("right");
    const canvas = document.getElementById("canvasRight");
    const ctx = canvas.getContext("2d");
    await paintPalmLines(ctx);   // 🌈 AI color lines
    drawPalm(ctx);
    lockAnimation(canvas);
  };

  // === AI Analyze Button Logic ===
  aiBtn.onclick = async () => {
    aiBtn.disabled = true;
    aiBtn.textContent = "🤖 Reading your palm...";
    reportBox.textContent = "AI Buddhi is perceiving energy lines and vibrations ...";
    reportBox.style.textShadow = "0 0 12px #16f0a7";

    try {
      const report = await analyzePalm("right", "canvasRight");

      // show report in box
      reportBox.innerHTML = `<p>${report}</p>`;
      console.log("AI Buddhi report generated →", report);

      // 🗣️ AI voice reading
      speak(report);
    } catch (err) {
      console.error("AI analysis error:", err);
      reportBox.textContent = "⚠️ Error reading palm data – check camera or reload page.";
    }

    aiBtn.textContent = "🧠 AI Analyze Palm";
    aiBtn.disabled = false;
    setTimeout(() => (reportBox.style.textShadow = "none"), 2000);
  };
});
