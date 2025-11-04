// main.js — V18.6 AI Palm Fit Alignment Edition
import { startCam, capture } from "./camera.js";
import { analyzePalm } from "./brain.js";
import { drawPalm } from "./lines.js";
import { analyzeEdges } from "./opencv-helper.js";

// 🌱 Load Seed Core data
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

// 🔒 Capture lock animation
function lockAnimation(canvas) {
  const overlay = document.createElement("div");
  overlay.className = "lockOverlay";
  overlay.textContent = "🔒 Captured — analyzing...";
  canvas.parentElement.appendChild(overlay);
  setTimeout(() => overlay.remove(), 1600);
}

// 🌟 Core Overlay Display
function showCoreOverlay() {
  if (!coreData.name) return;
  const overlay = document.createElement("div");
  overlay.className = "coreOverlay";
  overlay.innerHTML = `
    <h2>🌟 ${coreData.name}</h2>
    <p>ID: ${coreData.id}</p>
  `;
  document.body.appendChild(overlay);
  setTimeout(() => {
    overlay.style.opacity = "0";
    overlay.style.transform = "translateY(-30px)";
    setTimeout(() => overlay.remove(), 2000);
  }, 5000);
}

// 🎯 Auto-fit alignment
function autoFitCanvas(canvas) {
  const ctx = canvas.getContext("2d");
  const offscreen = document.createElement("canvas");
  offscreen.width = canvas.width;
  offscreen.height = canvas.height;
  const octx = offscreen.getContext("2d");

  // Re-center & fit
  octx.drawImage(canvas, 0, 0, canvas.width, canvas.height);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(offscreen, 0, 0, canvas.width, canvas.height);
  console.log("🎯 AutoFit applied to canvas:", canvas.id);
}

// 🧠 Initialize system
document.addEventListener("DOMContentLoaded", () => {
  const status = document.getElementById("status");
  const reportBox = document.getElementById("reportBox");

  if (!coreData.name)
    status.textContent = "🧠 Initializing AI Modules...";
  else
    status.textContent = `🌟 AI Buddhi Ready — Linked to ${coreData.name}`;

  showCoreOverlay();

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
      autoFitCanvas(canvas);
      lockAnimation(canvas);
      await new Promise(r => setTimeout(r, 1500));
      await analyzeEdges("canvasLeft");
    };

    rightCapture.onclick = async () => {
      capture("right");
      const canvas = document.getElementById("canvasRight");
      const ctx = canvas.getContext("2d");
      drawPalm(ctx);
      autoFitCanvas(canvas);
      lockAnimation(canvas);
      await new Promise(r => setTimeout(r, 1500));
      await analyzeEdges("canvasRight");
    };
  } else {
    console.error("❌ Camera buttons not found — check HTML IDs!");
  }

  // 🧘 AI Analyze Button
  const aiBtn = document.createElement("button");
  aiBtn.textContent = "🧠 AI Analyze Palm";
  aiBtn.className = "analyzeBtn";
  document.body.appendChild(aiBtn);

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

// 🧾 Camera Permission Check
window.addEventListener(
  "click",
  async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      console.log("✅ Camera permission granted.");
    } catch (err) {
      alert("⚠️ Please allow camera access for AI Buddhi.");
      console.error(err);
    }
  },
  { once: true }
);
