// main.js — V25.5 Quantum Palm Analyzer (AI Palm Detection + Camera Toggle)
import { drawPalm } from "./lines.js";
import { detectPalmLines } from "./palmPipeline.js";
import { initNaturalPalm3D } from "./naturalPalm3D.js";

let leftCaptured = false;
let rightCaptured = false;
let useFrontCam = true; // ✅ Default: front camera

// === CAMERA MODE TOGGLE BUTTON ===
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.createElement("button");
  toggleBtn.textContent = "🔄 Switch to Back Camera";
  toggleBtn.style = `
    position: fixed; top: 15px; right: 15px;
    background: #00e5ff22; color: #00e5ff;
    border: 1px solid #00e5ff; border-radius: 8px;
    padding: 8px 14px; cursor: pointer; z-index: 999;
  `;
  document.body.appendChild(toggleBtn);

  toggleBtn.onclick = () => {
    useFrontCam = !useFrontCam;
    toggleBtn.textContent = useFrontCam
      ? "🔄 Switch to Back Camera"
      : "🔄 Switch to Front Camera";
    document.getElementById("status").textContent = useFrontCam
      ? "📷 Using FRONT camera mode"
      : "📷 Using BACK camera mode";
  };

  // link all buttons
  linkButtonEvents();
});

// === LINK CAMERA BUTTONS ===
function linkButtonEvents() {
  document.getElementById("startCamLeft").onclick = () => startCam("left");
  document.getElementById("startCamRight").onclick = () => startCam("right");
  document.getElementById("captureLeft").onclick = () => capture("left");
  document.getElementById("captureRight").onclick = () => capture("right");
}

// === START CAMERA ===
async function startCam(side) {
  const vid = document.getElementById(side === "left" ? "vidLeft" : "vidRight");
  const canvas = document.getElementById(side === "left" ? "canvasLeft" : "canvasRight");

  try {
    const mode = useFrontCam ? "user" : "environment";
    console.log(`🎥 Starting ${side} camera in ${mode} mode...`);

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: mode } },
      audio: false
    });

    vid.srcObject = stream;
    await vid.play();
    vid.style.display = "block";
    canvas.style.display = "none";
    document.getElementById("status").textContent = `📷 ${side} camera started (${mode})`;
  } catch (err) {
    console.error("Camera start error:", err);
    alert(`Please allow camera access for ${side} hand`);
  }
}

// === CAPTURE FRAME ===
async function capture(side) {
  const vid = document.getElementById(side === "left" ? "vidLeft" : "vidRight");
  const canvas = document.getElementById(side === "left" ? "canvasLeft" : "canvasRight");
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const vw = vid.videoWidth || canvas.width;
  const vh = vid.videoHeight || canvas.height;
  const cw = canvas.width;
  const ch = (vh / vw) * cw;
  canvas.height = ch;

  // Mirror correction (front cam)
  if (useFrontCam) {
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(vid, -cw, 0, cw, ch);
    ctx.restore();
  } else {
    ctx.drawImage(vid, 0, 0, cw, ch);
  }

  // stop camera stream
  const stream = vid.srcObject;
  if (stream) stream.getTracks().forEach(t => t.stop());
  vid.srcObject = null;
  vid.style.display = "none";
  canvas.style.display = "block";

  document.getElementById("status").textContent = `✅ ${side} palm captured`;

  // === Try AI Palm Detection ===
  try {
    await detectPalmLines(canvas);
    document.getElementById("status").textContent = `🤖 ${side} palm analyzed`;
  } catch (e) {
    console.warn("AI detection fallback to drawn lines:", e);
    drawPalm(ctx); // fallback
  }
}

// === OPTIONAL VISUAL BEAM EFFECT ===
function addBeamOverlay(canvas) {
  const ctx = canvas.getContext("2d");
  const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  grad.addColorStop(0, "rgba(0,229,255,0.1)");
  grad.addColorStop(1, "rgba(255,255,255,0.05)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
