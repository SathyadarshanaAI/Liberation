// main.js — V17.8 Stable · AI Buddhi Palm Analyzer
import { startCam, capture } from "./camera.js";
import { analyzePalm } from "./brain.js";
import { drawPalm } from "./lines.js"; // 🪷 Palm line visual overlay

// 🗣️ Voice system
function speak(text) {
  if (!("speechSynthesis" in window)) return;
  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = "en-US";
  msg.rate = 1;
  msg.pitch = 1;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(msg);
}

// 🔒 Lock overlay animation
function lockAnimation(canvas) {
  const overlay = document.createElement("div");
  overlay.className = "lockOverlay";
  overlay.textContent = "🔒 Captured — analyzing...";
  canvas.parentElement.appendChild(overlay);
  setTimeout(() => overlay.remove(), 1800);
}

// 🧠 Initialize system
document.addEventListener("DOMContentLoaded", () => {
  const status = document.getElementById("status");
  const reportBox = document.getElementById("reportBox");

  // 🌸 Boot message
  status.textContent = "🧠 Initializing AI Modules...";
  setTimeout(() => {
    status.textContent = "✅ AI Buddhi Ready for Palm Analysis";
  }, 1200);

  // 🎥 Camera controls
  const leftStart = document.getElementById("startCamLeft");
  const rightStart = document.getElementById("startCamRight");
  const leftCapture = document.getElementById("captureLeft");
  const rightCapture = document.getElementById("captureRight");

  if (leftStart && rightStart && leftCapture && rightCapture) {
    leftStart.onclick = () => startCam("left");
    rightStart.onclick = () => startCam("right");

    leftCapture.onclick = () => {
      capture("left");
      const canvas = document.getElementById("canvasLeft");
      const ctx = canvas.getContext("2d");
      drawPalm(ctx);
      lockAnimation(canvas);
    };

    rightCapture.onclick = () => {
      capture("right");
      const canvas = document.getElementById("canvasRight");
      const ctx = canvas.getContext("2d");
      drawPalm(ctx);
      lockAnimation(canvas);
    };
  } else {
    console.error("❌ Camera buttons not found — check HTML IDs!");
  }

  // 🧘 Create AI Analyze button dynamically
  const aiBtn = document.createElement("button");
  aiBtn.textContent = "🧠 AI Analyze Palm";
  aiBtn.className = "analyzeBtn";
  document.body.appendChild(aiBtn);

  // ⚡ Analyze button logic
  aiBtn.onclick = async () => {
    aiBtn.disabled = true;
    aiBtn.textContent = "🤖 Reading your palm...";
    reportBox.textContent =
      "AI Buddhi is perceiving energy lines and subtle vibrations ...";
    reportBox.style.textShadow = "0 0 12px #16f0a7";

    try {
      const report = await analyzePalm("right", "canvasRight");
      reportBox.innerHTML = `<p>${report}</p>`;
      speak(report);
      console.log("✅ AI Buddhi report generated →", report);
    } catch (err) {
      console.error("AI analysis error:", err);
      reportBox.textContent =
        "⚠️ Error reading palm data – check camera or reload page.";
    }

    aiBtn.textContent = "🧠 AI Analyze Palm";
    aiBtn.disabled = false;
    setTimeout(() => (reportBox.style.textShadow = "none"), 2000);
  };
});

// 🧾 Camera Permission Auto-Check
window.addEventListener("click", async () => {
  if (!navigator.mediaDevices) {
    alert("Camera not supported on this device.");
    return;
  }
  try {
    await navigator.mediaDevices.getUserMedia({ video: true });
    console.log("✅ Camera permission granted.");
  } catch (err) {
    alert("⚠️ Please allow camera access for AI Buddhi to read your palm.");
    console.error(err);
  }
}, { once: true });
