// main.js — V25.0 Quantum Palm Analyzer (Camera Toggle + Dual Palm System)
import { drawPalm } from "./lines.js";
import { initBuddhiPipeline } from "./palmPipeline.js";
import { initNaturalPalm3D } from "./naturalPalm3D.js";

let leftCaptured = false;
let rightCaptured = false;
let useFrontCam = true; // ✅ toggle camera mode (default = front cam)

// === TOGGLE CAMERA MODE ===
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

  // link capture & start buttons after DOM loaded
  linkButtonEvents();
});

function linkButtonEvents() {
  document.getElementById("startCamLeft").onclick = () => startCam("left");
  document.getElementById("startCamRight").onclick = () => startCam("right");
  document.getElementById("captureLeft").onclick = () => capture("left");
  document.getElementById("captureRight").onclick = () => capture("right");
}

// === Start Camera ===
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

    document.getElementById("status").textContent = `📷 ${side.toUpperCase()} (${mode}) camera active`;
  } catch (err) {
    console.error(`❌ Camera start error (${side}):`, err);
    alert(`Please allow camera access for ${side} hand.`);
  }
}

// === Capture Function ===
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

  // Mirror left-hand if using front cam
  if (useFrontCam && side === "left") {
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(vid, -cw, 0, cw, ch);
    ctx.restore();
  } else {
    ctx.drawImage(vid, 0, 0, cw, ch);
  }

  // Stop stream
  const stream = vid.srcObject;
  if (stream) stream.getTracks().forEach(t => t.stop());
  vid.srcObject = null;
  vid.style.display = "none";
  canvas.style.display = "block";

  // Add subtle palm beam
  addBeamOverlay(canvas);

  // Delay and draw palm lines
  setTimeout(() => {
    try {
      drawPalm(ctx);
      console.log(`✨ ${side} palm overlay rendered`);
    } catch (e) {
      console.error("⚠️ lines.js overlay error:", e);
    }
  }, 600);

  document.getElementById("status").textContent = `✅ ${side} palm captured`;
  if (side === "left") leftCaptured = true; else rightCaptured = true;

  if (leftCaptured && rightCaptured) {
    initBuddhiPipeline();
    initNaturalPalm3D();
    document.getElementById("status").textContent =
      "🌟 Both palms captured — Ready for Quantum Analysis";
  }
}

// === Beam Overlay Effect ===
function addBeamOverlay(canvas) {
  const ctx = canvas.getContext("2d");
  const g = ctx.createRadialGradient(
    canvas.width / 2, canvas.height * 0.8, 10,
    canvas.width / 2, canvas.height, canvas.width / 1.2
  );
  g.addColorStop(0, "rgba(0,229,255,0.1)");
  g.addColorStop(1, "rgba(0,0,0,0.9)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  console.log("🌈 Beam overlay added.");
}
