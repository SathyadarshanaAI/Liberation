// main.js — V18.2 Core-Linked Analyzer Edition
import { startCam, capture } from "./camera.js";
import { analyzePalm } from "./brain.js";
import { drawPalm } from "./lines.js";
import { analyzeEdges } from "./opencv-helper.js";

// 🌟 Auto-load Seed Core Data
let coreData = {};
try {
  coreData = JSON.parse(localStorage.getItem("userData")) || {};
  if (coreData.name) {
    console.log(`🔗 Core Linked: ${coreData.name} (${coreData.id})`);
    const statusEl = document.getElementById("status");
    if (statusEl)
      statusEl.textContent = `🌟 Welcome ${coreData.name} (${coreData.id}) — Core Linked`;
  } else {
    console.warn("⚠️ No Seed Core data found.");
  }
} catch (e) {
  console.error("Core data read error:", e);
}

// 🗣️ Voice
function speak(text) {
  if (!("speechSynthesis" in window)) return;
  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = "en-US";
  msg.rate = 1;
  msg.pitch = 1;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(msg);
}

// 🔒 Lock overlay
function lockAnimation(canvas) {
  const overlay = document.createElement("div");
  overlay.className = "lockOverlay";
  overlay.textContent = "🔒 Captured — analyzing...";
  canvas.parentElement.appendChild(overlay);
  setTimeout(() => overlay.remove(), 1800);
}

document.addEventListener("DOMContentLoaded", () => {
  const status = document.getElementById("status");
  const reportBox = document.getElementById("reportBox");

  // 🌸 Boot message
  if (!coreData.name)
    status.textContent = "🧠 Initializing AI Modules...";
  else
    status.textContent = `🌟 AI Buddhi Ready — Linked to ${coreData.name}`;

  // 🎥 Camera controls
  const leftStart = document.getElementById("startCamLeft");
  const rightStart = document.getElementById("startCamRight");
  const leftCapture = document.getElementById("captureLeft");
  const rightCapture = document.getElementById("captureRight");

  if (leftStart && rightStart && leftCapture && rightCapture) {
    leftStart.onclick = () => startCam("left");
    rightStart.onclick = () => startCam("right");

    leftCapture.onclick = async () => {
      capture("left");
      const canvas = document.getElementById("canvasLeft");
      const ctx = canvas.getContext("2d");
      drawPalm(ctx);
      lockAnimation(canvas);
      await new Promise(r => setTimeout(r, 800));
      await analyzeEdges("canvasLeft");
    };

    rightCapture.onclick = async () => {
      capture("right");
      const canvas = document.getElementById("canvasRight");
      const ctx = canvas.getContext("2d");
      drawPalm(ctx);
      lockAnimation(canvas);
      await new Promise(r => setTimeout(r, 800));
      await analyzeEdges("canvasRight");
    };
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
    reportBox.textContent = "AI Buddhi is perceiving energy lines...";
    reportBox.style.textShadow = "0 0 12px #16f0a7";

    try {
      const report = await analyzePalm("right", "canvasRight");
      const header = coreData.name ? `<h3>🌟 ${coreData.name} (${coreData.id})</h3>` : "";
      reportBox.innerHTML = `${header}<p>${report}</p>`;
      speak(`${coreData.name ? coreData.name + "," : ""} ${report}`);
    } catch (err) {
      console.error(err);
      reportBox.textContent = "⚠️ Error reading palm data.";
    }

    aiBtn.textContent = "🧠 AI Analyze Palm";
    aiBtn.disabled = false;
    setTimeout(() => (reportBox.style.textShadow = "none"), 2000);
  };
});

// 🧾 Camera Permission Auto-Check
window.addEventListener(
  "click",
  async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      console.log("✅ Camera permission granted.");
    } catch (err) {
      alert("⚠️ Please allow camera access.");
      console.error(err);
    }
  },
  { once: true }
);
