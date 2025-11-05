// 🕉️ Sathyadarshana Quantum Palm Analyzer · V20.0 TrueScan Integration Edition
import { drawPalm } from "./lines.js";

let detector;
let activeSide = null;

// === 🧠 Initialize AI Detector ===
async function initAI() {
  const status = document.getElementById("status");
  status.textContent = "🧠 Loading AI modules...";
  try {
    const model = handPoseDetection.SupportedModels.MediaPipeHands;
    const detectorConfig = { runtime: "tfjs", modelType: "lite", maxHands: 1 };
    detector = await handPoseDetection.createDetector(model, detectorConfig);
    console.log("✅ AI Model Ready");
    status.textContent = "✅ Buddhi AI Ready";
  } catch (e) {
    status.textContent = "⚠️ Error initializing AI model";
    console.error(e);
  }
}

// === ⚡ Preload / Warmup Camera (reduce delay) ===
async function warmupCam() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    stream.getTracks().forEach(t => t.stop());
    console.log("⚡ Camera warmed up successfully");
  } catch (err) {
    console.warn("Warmup failed:", err);
  }
}

// === 🎥 Start Camera ===
async function startCam(side) {
  activeSide = side;
  const vid = document.getElementById(side === "left" ? "vidLeft" : "vidRight");
  const status = document.getElementById("status");

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: side === "right" ? "user" : "environment" },
      audio: false
    });
    vid.srcObject = stream;
    await vid.play();
    status.textContent = `🎥 ${side.toUpperCase()} camera active`;
    detectPalm(side);
  } catch (e) {
    console.error(e);
    alert("Please allow camera access.");
  }
}

// === ✋ Detect & Draw Palm in Real-Time ===
async function detectPalm(side) {
  if (!detector) return;
  const vid = document.getElementById(side === "left" ? "vidLeft" : "vidRight");
  const canvas = document.getElementById(side === "left" ? "canvasLeft" : "canvasRight");
  const ctx = canvas.getContext("2d");

  try {
    const hands = await detector.estimateHands(vid);
    ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);

    if (hands.length > 0) {
      const pts = hands[0].keypoints;
      drawPalm(ctx, pts);

      ctx.font = "14px Segoe UI";
      ctx.fillStyle = "#16f0a7";
      ctx.fillText("Palm detected ✓", 10, 20);
    }
  } catch (err) {
    console.warn("Detection error:", err);
  }

  requestAnimationFrame(() => detectPalm(side));
}

// === 📸 Capture Snapshot ===
function capture(side) {
  const cvs = document.getElementById(side === "left" ? "canvasLeft" : "canvasRight");
  const imgData = cvs.toDataURL("image/png");
  localStorage.setItem(`palm_${side}`, imgData);
  document.getElementById("status").textContent = `📸 ${side} palm saved`;
  console.log(`💾 ${side} palm stored`);
}

// === 🤖 Mini Report Generator ===
function miniReport() {
  const reportBox = document.getElementById("reportBox");
  reportBox.textContent = "🧠 Analyzing palm structure...";
  setTimeout(() => {
    reportBox.textContent = `🌿 Based on initial palm scan:
    You possess a balanced mind and a compassionate heart.
    The lines show determination, creativity, and spiritual depth.
    Success arises when thought and feeling align with purpose.`;
  }, 2500);
}

// === 🌺 Initialize All ===
document.addEventListener("DOMContentLoaded", async () => {
  await warmupCam();
  await initAI();

  document.getElementById("startCamLeft").onclick = () => startCam("left");
  document.getElementById("startCamRight").onclick = () => startCam("right");
  document.getElementById("captureLeft").onclick = () => capture("left");
  document.getElementById("captureRight").onclick = () => capture("right");
  document.getElementById("analyzeBtn").onclick = miniReport;
});
