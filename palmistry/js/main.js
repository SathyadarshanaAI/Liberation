// main.js — V24.9.1 Hybrid Camera Fix Edition

import { drawPalm } from "./js/lines.js";
import { initBuddhiPipeline } from "./js/palmPipeline.js";
import { initNaturalPalm3D } from "./js/naturalPalm3D.js";

let leftCaptured = false, rightCaptured = false;

// === Start Camera with Fallback ===
async function startCam(side) {
  const vid = document.getElementById(side === "left" ? "vidLeft" : "vidRight");
  const canvas = document.getElementById(side === "left" ? "canvasLeft" : "canvasRight");
  let constraints = {
    video: { facingMode: side === "left" ? "user" : { ideal: "environment" } },
    audio: false
  };
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    vid.srcObject = stream;
    await vid.play();
    vid.style.display = "block";
    canvas.style.display = "none";
    document.getElementById("status").textContent = `📷 ${side} camera started`;
  } catch (err) {
    try {
      const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      vid.srcObject = fallbackStream;
      await vid.play();
      vid.style.display = "block";
      canvas.style.display = "none";
      document.getElementById("status").textContent = `📷 ${side} (fallback) camera started`;
    } catch (fallbackErr) {
      alert(`Camera not available for ${side} hand.`);
      document.getElementById("status").textContent = "🚫 Camera not available!";
    }
  }
}

// === Capture with Metadata Ready Check ===
function capture(side) {
  const vid = document.getElementById(side === "left" ? "vidLeft" : "vidRight");
  const canvas = document.getElementById(side === "left" ? "canvasLeft" : "canvasRight");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  function doCapture() {
    const vw = vid.videoWidth || 280;
    const vh = vid.videoHeight || 360;
    const cw = canvas.width = 280;
    const ch = canvas.height = (vh / vw) * 280;

    if (side === "left") {
      ctx.drawImage(vid, 0, 0, cw, ch);
    } else {
      ctx.save();
      ctx.translate(cw, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(vid, 0, 0, cw, ch);
      ctx.restore();
    }

    let stream = vid.srcObject;
    if (stream) stream.getTracks().forEach(t => t.stop());
    vid.srcObject = null;
    vid.style.display = "none";
    canvas.style.display = "block";

    addBeamOverlay(canvas);

    setTimeout(() => {
      try {
        drawPalm(ctx);
      } catch (e) {
        console.error("⚠️ drawPalm error:", e);
      }
    }, 700);

    document.getElementById("status").textContent = `✅ ${side} palm captured`;
    if (side === "left") leftCaptured = true;
    else rightCaptured = true;
    if (leftCaptured && rightCaptured) {
      document.getElementById("status").textContent = "🌟 Both palms captured – Ready for AI Analysis";
    }
  }

  if (vid.readyState < 2) vid.onloadedmetadata = doCapture;
  else doCapture();
}

// === Beam Overlay ===
function addBeamOverlay(canvas) {
  const ctx = canvas.getContext("2d");
  const w = canvas.width, h = canvas.height;
  const beam = document.createElement("canvas");
  beam.width = w; beam.height = h;
  const bctx = beam.getContext("2d");

  const grad = bctx.createRadialGradient(w/2, h/2, 40, w/2, h/2, Math.max(w,h)/1.1);
  grad.addColorStop(0, "rgba(0,255,255,0.05)");
  grad.addColorStop(0.5, "rgba(255,215,0,0.03)");
  grad.addColorStop(1, "rgba(0,0,0,0)");
  bctx.fillStyle = grad;
  bctx.fillRect(0, 0, w, h);
  ctx.drawImage(beam, 0, 0);
}

// === DOM bindings on DOMContentLoaded ===
window.addEventListener("DOMContentLoaded", () => {
  // Bind buttons safely AFTER DOM is ready
  document.getElementById("startCamLeft").onclick = () => startCam("left");
  document.getElementById("captureLeft").onclick = () => capture("left");
  document.getElementById("startCamRight").onclick = () => startCam("right");
  document.getElementById("captureRight").onclick = () => capture("right");

  document.getElementById("analyzeAI").onclick = () => {
    document.getElementById("status").textContent = "🧠 Activating Buddhi Neural Pipeline...";
    initBuddhiPipeline();
    setTimeout(() => {
      document.getElementById("status").textContent = "✨ Neural Flow Stable – Palm Analyzer Ready";
    }, 3500);
  };

  initNaturalPalm3D("canvasRight");
});
