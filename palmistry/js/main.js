// main.js — V24.8 Natural Neural Fusion Edition
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
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: "environment" } },
      audio: false
    });
    vid.srcObject = stream;
    vid.style.display = "block";
    canvas.style.display = "none";
    document.getElementById("status").textContent = `📷 ${side} camera started`;
  } catch (err) {
    console.error(err);
    alert(`Please allow camera access for ${side} hand`);
  }
}

// === Capture (with previous-overlay clear) ===
function capture(side) {
  const vid = document.getElementById(side === "left" ? "vidLeft" : "vidRight");
  const canvas = document.getElementById(side === "left" ? "canvasLeft" : "canvasRight");
  const ctx = canvas.getContext("2d");

  // clear previous
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // adjust canvas height to keep aspect ratio
  const vw = vid.videoWidth || canvas.width;
  const vh = vid.videoHeight || canvas.height;
  const cw = canvas.width;
  const ch = (vh / vw) * cw;
  canvas.height = ch;

  // draw new capture
  ctx.drawImage(vid, 0, 0, cw, ch);

  // stop stream
  const stream = vid.srcObject;
  if (stream) stream.getTracks().forEach(t => t.stop());
  vid.style.display = "none";
  canvas.style.display = "block";

  // Beam overlay (subtle) — optional, keeps natural feel
  addBeamOverlay(canvas);

  // draw palm overlay after slight delay
  setTimeout(() => {
    try {
      drawPalm(ctx);
      console.log(`✨ New ${side} palm overlay rendered`);
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

// === Beam background (subtle) ===
function addBeamOverlay(canvas) {
  const ctx = canvas.getContext("2d");
  const w = canvas.width, h = canvas.height;
  const beam = document.createElement("canvas");
  beam.width = w; beam.height = h;
  const bctx = beam.getContext("2d");
  const grad = bctx.createRadialGradient(w/2, h/2, 30, w/2, h/2, Math.max(w,h)/1.2);
  grad.addColorStop(0, "rgba(0,255,255,0.06)");
  grad.addColorStop(0.5, "rgba(255,215,0,0.03)");
  grad.addColorStop(1, "rgba(0,0,0,0)");
  bctx.fillStyle = grad;
  bctx.fillRect(0, 0, w, h);

  try {
    const img = ctx.getImageData(0, 0, w, h);
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(beam, 0, 0);
    ctx.putImageData(img, 0, 0);
  } catch (e) {
    // some browsers may throw if canvas is tainted — fallback to drawImage only
    ctx.drawImage(beam, 0, 0);
  }
}

// === AI Analyze Button (connect pipeline) ===
document.getElementById("analyzeAI").onclick = () => {
  document.getElementById("status").textContent =
    "🧠 Activating Buddhi Neural Pipeline...";
  initBuddhiPipeline();
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

// === Initialize natural 3D palm once DOM ready ===
window.addEventListener("DOMContentLoaded", () => {
  console.log("🌿 Initializing Natural 3D Palm Interface...");
  initNaturalPalm3D("canvasRight");
});
