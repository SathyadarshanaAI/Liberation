// main.js — V25.0 Quantum Palm Analyzer (Camera Toggle + Dual Palm System)
import { drawPalm } from "./lines.js";
import { initBuddhiPipeline } from "./palmPipeline.js";
import { initNaturalPalm3D } from "./naturalPalm3D.js";

let leftCaptured = false;
let rightCaptured = false;
let useFrontCam = true; // ✅ Default = front cam

// === TOGGLE CAMERA MODE BUTTON ===
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

  // link buttons
  linkButtonEvents();
});

// === LINK BUTTONS ===
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

    document.getElementById("status").textContent = `✅ ${side} camera started (${mode})`;
  } catch (err) {
    console.error("Camera start error:", err);
    alert(`⚠️ Please allow camera access for ${side} hand`);
  }
}

// === CAPTURE IMAGE ===
function capture(side) {
  const vid = document.getElementById(side === "left" ? "vidLeft" : "vidRight");
  const canvas = document.getElementById(side === "left" ? "canvasLeft" : "canvasRight");
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const vw = vid.videoWidth || canvas.width;
  const vh = vid.videoHeight || canvas.height;
  const cw = canvas.width;
  const ch = (vh / vw) * cw;
  canvas.height = ch;

  // 🪞 Mirror front cam only
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

  document.getElementById("status").textContent = `📸 Captured ${side} hand`;

  // run palm analysis pipeline
  setTimeout(() => {
    processPalmImage(canvas, side);
  }, 300);
}

// === PALM PROCESSING ===
function processPalmImage(canvas, side) {
  try {
    const dataURL = canvas.toDataURL("image/png");
    console.log(`🧠 Processing ${side} hand...`);
    drawPalm(canvas, side);
    initBuddhiPipeline(dataURL, side);
    initNaturalPalm3D(canvas, side);
  } catch (e) {
    console.error("Palm processing error:", e);
  }
}

console.log("🌿 Quantum Palm Analyzer V25.0 loaded successfully");
