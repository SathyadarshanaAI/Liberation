// 🕉️ Sathyadarshana Quantum Palm Analyzer
// V24.5 · Neural Pipeline Linked Edition

import { drawPalm } from "./lines.js";
import { initBuddhiPipeline } from "./palmPipeline.js"; // 🧠 add this import

let leftCaptured = false;
let rightCaptured = false;

// === Start Camera ===
async function startCam(side) {
  const vid = document.getElementById(side === "left" ? "vidLeft" : "vidRight");
  const canvas = document.getElementById(side === "left" ? "canvasLeft" : "canvasRight");

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: "environment" } },
      audio: false
    });
    vid.srcObject = stream;
    vid.style.display = "block";
    canvas.style.display = "none";
    document.getElementById("status").textContent = `📷 ${side} camera started`;
  } catch {
    alert(`Please allow camera access for ${side} hand`);
  }
}

// === Capture ===
function capture(side) {
  const vid = document.getElementById(side === "left" ? "vidLeft" : "vidRight");
  const canvas = document.getElementById(side === "left" ? "canvasLeft" : "canvasRight");
  const ctx = canvas.getContext("2d");

  const vw = vid.videoWidth;
  const vh = vid.videoHeight;
  const cw = canvas.width;
  const ch = (vh / vw) * cw;
  canvas.height = ch;

  ctx.drawImage(vid, 0, 0, cw, ch);

  // stop stream
  const stream = vid.srcObject;
  if (stream) stream.getTracks().forEach(t => t.stop());
  vid.style.display = "none";
  canvas.style.display = "block";

  // Beam aura under palm
  addBeamOverlay(canvas);

  // Draw glowing palm lines with small delay
  setTimeout(() => {
    try {
      drawPalm(ctx);
      console.log("✨ Palm lines overlay rendered successfully");
    } catch (e) {
      console.error("⚠️ lines.js overlay error:", e);
    }
  }, 500);

  document.getElementById("status").textContent = `✅ ${side} palm captured`;

  if (side === "left") leftCaptured = true;
  else rightCaptured = true;
  if (leftCaptured && rightCaptured) {
    document.getElementById("status").textContent =
      "🌟 Both palms captured – Ready for AI Analysis";
  }
}

// === Beam background ===
function addBeamOverlay(canvas) {
  const ctx = canvas.getContext("2d");
  const w = canvas.width, h = canvas.height;
  const beam = document.createElement("canvas");
  beam.width = w; beam.height = h;
  const bctx = beam.getContext("2d");
  const grad = bctx.createRadialGradient(w / 2, h / 2, 30, w / 2, h / 2, w / 1.2);
  grad.addColorStop(0, "rgba(0,255,255,0.20)");
  grad.addColorStop(0.5, "rgba(255,215,0,0.10)");
  grad.addColorStop(1, "rgba(0,0,0,0)");
  bctx.fillStyle = grad;
  bctx.fillRect(0, 0, w, h);
  const img = ctx.getImageData(0, 0, w, h);
  ctx.clearRect(0, 0, w, h);
  ctx.drawImage(beam, 0, 0);
  ctx.putImageData(img, 0, 0);
}

// === AI Analyze Button (connect pipeline) ===
document.getElementById("analyzeAI").onclick = () => {
  document.getElementById("status").textContent =
    "🧠 Activating Buddhi Neural Pipeline...";
  initBuddhiPipeline(); // 🌐 Link Buddhi → Palm → Overlay
  setTimeout(() => {
    document.getElementById("status").textContent =
      "✨ Neural Flow Stable – Palm Analyzer Ready";
  }, 4000);
};

// === Buttons ===
document.getElementById("startCamLeft").onclick = () => startCam("left");
document.getElementById("captureLeft").onclick = () => capture("left");
document.getElementById("startCamRight").onclick = () => startCam("right");
document.getElementById("captureRight").onclick = () => capture("right");
