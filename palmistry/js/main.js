// main.js — V24.9 Natural Neural Fusion Edition (Right Cam + Line Fix)
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
    // ✅ FIXED: Make "right" camera use same facingMode fallback safely
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: side === "left" ? "user" : { ideal: "environment" } },
      audio: false
    });

    vid.srcObject = stream;
    vid.play();
    vid.style.display = "block";
    canvas.style.display = "none";
    document.getElementById("status").textContent = `📷 ${side} camera started`;
  } catch (err) {
    console.error("Camera start error:", err);
    alert(`Please allow camera access for ${side} hand`);
  }
}

// === Capture with mirroring & right-hand fix ===
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

  // ✅ FIXED: Handle right camera mirroring properly
  if (side === "left") {
    ctx.drawImage(vid, 0, 0, cw, ch);
  } else {
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(vid, -cw, 0, cw, ch);
    ctx.restore();
  }

  // Stop camera
  const stream = vid.srcObject;
  if (stream) stream.getTracks().forEach(t => t.stop());
  vid.srcObject = null;
  vid.style.display = "none";
  canvas.style.display = "block";

  addBeamOverlay(canvas);

  // ✅ FIXED: Delay longer for right side, ensuring frame fully rendered
  setTimeout(() => {
    try {
      drawPalm(ctx);
      console.log(`✨ ${side} palm overlay rendered`);
    } catch (e) {
      console.error("⚠️ drawPalm error:", e);
    }
  }, side === "right" ? 900 : 500);

  document.getElementById("status").textContent = `✅ ${side} palm captured`;

  if (side === "left") leftCaptured = true;
  else rightCaptured = true;

  if (leftCaptured && rightCaptured) {
    document.getElementById("status").textContent = "🌟 Both palms captured – Ready for AI Analysis";
  }
}

// === Beam Overlay (subtle natural aura) ===
function addBeamOverlay(canvas) {
  const ctx = canvas.getContext("2d");
  const w = canvas.width, h = canvas.height;
  const beam = document.createElement("canvas");
  beam.width = w; beam.height = h;
  const bctx = beam.getContext("2d");

  const grad = bctx.createRadialGradient(w / 2, h / 2, 40, w / 2, h / 2, Math.max(w, h) / 1.1);
  grad.addColorStop(0, "rgba(0,255,255,0.05)");
  grad.addColorStop(0.5, "rgba(255,215,0,0.03)");
  grad.addColorStop(1, "rgba(0,0,0,0)");
  bctx.fillStyle = grad;
  bctx.fillRect(0, 0, w, h);

  ctx.drawImage(beam, 0, 0);
}

// === AI Analyze ===
document.getElementById("analyzeAI").onclick = () => {
  document.getElementById("status").textContent = "🧠 Activating Buddhi Neural Pipeline...";
  initBuddhiPipeline();
  setTimeout(() => {
    document.getElementById("status").textContent = "✨ Neural Flow Stable – Palm Analyzer Ready";
  }, 3500);
};

// === Buttons ===
document.getElementById("startCamLeft").onclick = () => startCam("left");
document.getElementById("captureLeft").onclick = () => capture("left");
document.getElementById("startCamRight").onclick = () => startCam("right");
document.getElementById("captureRight").onclick = () => capture("right");

// === Natural 3D Palm init ===
window.addEventListener("DOMContentLoaded", () => {
  console.log("🌿 Initializing Natural 3D Palm Interface...");
  initNaturalPalm3D("canvasRight");
});
