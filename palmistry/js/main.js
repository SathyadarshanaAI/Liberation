// 🕉️ Sathyadarshana Quantum Palm Analyzer · V19.5 Freeze Lock + Save Confirm Edition
import { drawPalm } from "./lines.js";

let detector;
let activeStream = { left: null, right: null };
let isCaptured = { left: false, right: false };

// === Initialize AI Model ===
async function initAI() {
  const status = document.getElementById("status");
  try {
    const model = handPoseDetection.SupportedModels.MediaPipeHands;
    const detectorConfig = { runtime: "tfjs", modelType: "lite", maxHands: 1 };
    detector = await handPoseDetection.createDetector(model, detectorConfig);
    status.textContent = "✅ AI Palm Detector Ready";
  } catch (err) {
    console.error("❌ Error initializing AI model:", err);
    status.textContent = "⚠️ Failed to load AI model";
  }
}

// === Start Camera ===
async function startCam(side) {
  const vid = document.getElementById(side === "left" ? "vidLeft" : "vidRight");
  const status = document.getElementById("status");
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: "environment" }, width: 640, height: 480 },
      audio: false,
    });
    vid.srcObject = stream;
    activeStream[side] = stream;
    isCaptured[side] = false;
    await vid.play();
    status.textContent = `🎥 ${side} camera active`;
    detectHand(side);
  } catch (err) {
    console.error(`❌ ${side} camera error:`, err);
    alert(`⚠️ Please allow camera access for ${side} hand`);
  }
}

// === Live Detection Loop ===
async function detectHand(side) {
  const vid = document.getElementById(side === "left" ? "vidLeft" : "vidRight");
  const canvas = document.getElementById(
    side === "left" ? "canvasLeft" : "canvasRight"
  );
  const ctx = canvas.getContext("2d");

  if (!detector || !vid) return;

  if (isCaptured[side]) return; // stop loop after capture

  try {
    const predictions = await detector.estimateHands(vid);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);

    if (predictions.length > 0) {
      const keypoints = predictions[0].keypoints;
      ctx.strokeStyle = "#00e5ff";
      ctx.lineWidth = 2;
      ctx.shadowColor = "#16f0a7";
      ctx.shadowBlur = 10;

      const wrist = keypoints[0];
      const indexBase = keypoints[5];
      const pinkyBase = keypoints[17];

      ctx.beginPath();
      ctx.moveTo(wrist.x, wrist.y);
      ctx.lineTo(indexBase.x, indexBase.y);
      ctx.lineTo(pinkyBase.x, pinkyBase.y);
      ctx.closePath();
      ctx.stroke();

      drawPalm(ctx, keypoints);
    }
  } catch (err) {
    console.warn(`⚠️ Detection (${side}) error:`, err);
  }

  requestAnimationFrame(() => detectHand(side));
}

// === Capture Function ===
function capture(side) {
  const vid = document.getElementById(side === "left" ? "vidLeft" : "vidRight");
  const canvas = document.getElementById(
    side === "left" ? "canvasLeft" : "canvasRight"
  );
  const ctx = canvas.getContext("2d");

  // Draw final frame & freeze
  ctx.filter = "brightness(1.2) contrast(1.1)";
  ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);

  // Stop camera stream
  const stream = activeStream[side];
  if (stream) stream.getTracks().forEach(t => t.stop());

  isCaptured[side] = true;

  // Save snapshot
  const img = canvas.toDataURL("image/png");
  localStorage.setItem(`palm_${side}`, img);
  document.getElementById("status").textContent = `📸 ${side} palm captured`;
}

// === Initialize ===
document.addEventListener("DOMContentLoaded", async () => {
  await initAI();

  document.getElementById("startCamLeft").onclick = () => startCam("left");
  document.getElementById("startCamRight").onclick = () => startCam("right");

  document.getElementById("captureLeft").onclick = () => capture("left");
  document.getElementById("captureRight").onclick = () => capture("right");

  document.getElementById("analyzeBtn").onclick = () => {
    const reportBox = document.getElementById("reportBox");
    reportBox.textContent =
      "🌟 Analysis Complete — Your palm lines have been successfully recorded!";
  };
});
