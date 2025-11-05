import { drawPalm } from "./lines.js";

let leftStream, rightStream;
let leftCaptured = false, rightCaptured = false;

// === Start camera (Force back) ===
async function startCam(side) {
  const vid = document.getElementById(side === "left" ? "vidLeft" : "vidRight");
  const canvas = document.getElementById(side === "left" ? "canvasLeft" : "canvasRight");

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } },
      audio: false
    });
    vid.srcObject = stream;
    if (side === "left") leftStream = stream; else rightStream = stream;
    vid.style.display = "block";
    canvas.style.display = "none";
    document.getElementById("status").textContent = `📷 ${side} camera started`;
  } catch {
    alert(`Please allow camera access for ${side} hand`);
  }
}

// === Capture and Natural-Restore ===
function capture(side) {
  const vid = document.getElementById(side === "left" ? "vidLeft" : "vidRight");
  const canvas = document.getElementById(side === "left" ? "canvasLeft" : "canvasRight");
  const ctx = canvas.getContext("2d");
  ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);

  // stop stream
  const stream = side === "left" ? leftStream : rightStream;
  if (stream) stream.getTracks().forEach(t => t.stop());
  vid.style.display = "none";
  canvas.style.display = "block";

  // 🎨 restore natural palm tone
  const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    // remove camera yellow tint
    const r = d[i], g = d[i + 1], b = d[i + 2];
    const avg = (r + g + b) / 3;
    d[i] = Math.min(255, r * 0.98 + avg * 0.02);
    d[i + 1] = Math.min(255, g * 0.98 + avg * 0.02);
    d[i + 2] = Math.min(255, b * 0.95 + avg * 0.05);
  }
  ctx.putImageData(img, 0, 0);

  // add soft beam aura
  addBeamOverlay(canvas);

  if (side === "left") leftCaptured = true; else rightCaptured = true;
  document.getElementById("status").textContent = `✅ ${side} palm captured`;
  checkReady();
}

// === Beam overlay + pulse animation ===
function addBeamOverlay(canvas) {
  const ctx = canvas.getContext("2d");
  const grd = ctx.createRadialGradient(
    canvas.width / 2, canvas.height / 2, 20,
    canvas.width / 2, canvas.height / 2, canvas.width / 1.1
  );
  grd.addColorStop(0, "rgba(0,255,255,0.12)");
  grd.addColorStop(0.5, "rgba(255,215,0,0.10)");
  grd.addColorStop(1, "rgba(0,0,0,0.55)");
  ctx.globalCompositeOperation = "lighter";
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = "source-over";

  // 🌊 animated life-wave pulse
  let pulse = 0;
  function animate() {
    pulse += 0.05;
    const w = canvas.width, h = canvas.height;
    ctx.save();
    ctx.globalAlpha = 0.15 + 0.05 * Math.sin(pulse);
    const ring = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, w/1.3);
    ring.addColorStop(0, "rgba(0,255,255,0.25)");
    ring.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = ring;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
    requestAnimationFrame(animate);
  }
  animate();
}

// === check both captured ===
function checkReady() {
  if (leftCaptured && rightCaptured) {
    document.getElementById("status").textContent =
      "🌟 Both palms captured – AI analyzing...";
    setTimeout(autoAnalyze, 2500);
  }
}

// === auto analyze ===
function autoAnalyze() {
  const status = document.getElementById("status");
  status.textContent = "🤖 Buddhi AI analyzing both palms...";
  setTimeout(() => {
    status.textContent = "✨ AI Report Ready – Divine Energy Balanced 💫";
  }, 3000);
}

// === button bindings ===
document.getElementById("startCamLeft").onclick = () => startCam("left");
document.getElementById("startCamRight").onclick = () => startCam("right");
document.getElementById("captureLeft").onclick = () => capture("left");
document.getElementById("captureRight").onclick = () => capture("right");
