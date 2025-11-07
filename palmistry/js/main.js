// main.js — V24.9.1 Stable Dual Camera Edition
import { drawPalm } from "./lines.js";
import { initBuddhiPipeline } from "./palmPipeline.js";
import { initNaturalPalm3D } from "./naturalPalm3D.js";

let leftCaptured = false;
let rightCaptured = false;

// === Start Camera ===
async function startCam(side) {
  const vid = document.getElementById(side === "left" ? "vidLeft" : "vidRight");
  const canvas = document.getElementById(side === "left" ? "canvasLeft" : "canvasRight");

  try {
    console.log(`🎥 Starting ${side} camera...`);

    const constraints = {
      video: { facingMode: side === "left" ? "user" : { ideal: "environment" } },
      audio: false
    };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    vid.srcObject = stream;
    vid.play();
    vid.style.display = "block";
    canvas.style.display = "none";

    document.getElementById("status").textContent = `📷 ${side.toUpperCase()} camera active`;
  } catch (err) {
    console.error(`❌ Camera start error (${side}):`, err);
    alert(`Please allow camera access for ${side} hand.`);
  }
}

// === Capture Image ===
function capture(side) {
  const vid = document.getElementById(side === "left" ? "vidLeft" : "vidRight");
  const canvas = document.getElementById(side === "left" ? "canvasLeft" : "canvasRight");
  const ctx = canvas.getContext("2d");

  if (!vid.srcObject) {
    alert(`⚠️ ${side} camera is not active!`);
    return;
  }

  console.log(`📸 Capturing ${side} hand...`);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const vw = vid.videoWidth || canvas.width;
  const vh = vid.videoHeight || canvas.height;
  const cw = canvas.width;
  const ch = (vh / vw) * cw;
  canvas.height = ch;

  if (side === "left") {
    ctx.drawImage(vid, 0, 0, cw, ch);
  } else {
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(vid, -cw, 0, cw, ch);
    ctx.restore();
  }

  // stop stream
  const stream = vid.srcObject;
  if (stream) stream.getTracks().forEach(t => t.stop());
  vid.srcObject = null;
  vid.style.display = "none";
  canvas.style.display = "block";

  addBeamOverlay(canvas);

  // Delay for rendering lines
  setTimeout(() => {
    try {
      drawPalm(ctx);
      console.log(`✨ ${side} palm overlay drawn successfully`);
    } catch (e) {
      console.error("⚠️ Palm overlay error:", e);
    }
  }, 600);

  document.getElementById("status").textContent = `✅ ${side} palm captured`;

  if (side === "left") leftCaptured = true;
  else rightCaptured = true;

  // trigger full system once both captured
  if (leftCaptured && rightCaptured) {
    console.log("🧠 Both palms ready → launching Buddhi pipeline...");
    initNaturalPalm3D();
    initBuddhiPipeline();
    document.getElementById("status").textContent = "🔮 Dual palm neural link established!";
  }
}

// === Add subtle beam effect ===
function addBeamOverlay(canvas) {
  const ctx = canvas.getContext("2d");
  const grad = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 20, canvas.width / 2, canvas.height / 2, 180);
  grad.addColorStop(0, "rgba(0,229,255,0.15)");
  grad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  console.log("🌐 Beam overlay added");
}

// === Event bindings ===
document.addEventListener("DOMContentLoaded", () => {
  console.log("🧩 Initializing system...");

  const startLeft = document.getElementById("startCamLeft");
  const startRight = document.getElementById("startCamRight");
  const capLeft = document.getElementById("captureLeft");
  const capRight = document.getElementById("captureRight");

  if (startLeft) startLeft.addEventListener("click", () => startCam("left"));
  if (startRight) startRight.addEventListener("click", () => startCam("right"));
  if (capLeft) capLeft.addEventListener("click", () => capture("left"));
  if (capRight) capRight.addEventListener("click", () => capture("right"));

  console.log("✅ Event listeners attached. Ready for user action.");
});
