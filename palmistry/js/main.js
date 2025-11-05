import { drawPalm } from "./lines.js";

let detector;
let leftStream, rightStream;
let leftCaptured = false, rightCaptured = false;

// === Initialize AI ===
async function initAI() {
  const status = document.getElementById("status");
  status.textContent = "🧠 Loading AI modules...";
  try {
    const model = handPoseDetection.SupportedModels.MediaPipeHands;
    const config = { runtime: "tfjs", modelType: "lite", maxHands: 1 };
    detector = await handPoseDetection.createDetector(model, config);
    status.textContent = "✅ Buddhi AI Ready";
  } catch (err) {
    status.textContent = "⚠️ AI initialization failed";
    console.error(err);
  }
}

// === Start Camera (Force Back Camera) ===
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
  } catch (err) {
    alert(`Please allow camera access for ${side} hand`);
  }
}

// === Capture + Natural Tone Normalize ===
function capture(side) {
  const vid = document.getElementById(side === "left" ? "vidLeft" : "vidRight");
  const canvas = document.getElementById(side === "left" ? "canvasLeft" : "canvasRight");
  const ctx = canvas.getContext("2d");

  ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);

  // 🧩 Natural tone correction
  const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = img.data;
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.min(255, data[i] * 1.05);     // R boost
    data[i + 1] = Math.min(255, data[i + 1] * 1.05); // G
    data[i + 2] = Math.min(255, data[i + 2] * 1.1);  // B slight
  }
  ctx.putImageData(img, 0, 0);

  // Stop stream
  const stream = side === "left" ? leftStream : rightStream;
  if (stream) stream.getTracks().forEach(t => t.stop());
  vid.style.display = "none";
  canvas.style.display = "block";

  if (side === "left") leftCaptured = true; else rightCaptured = true;
  document.getElementById("status").textContent = `✅ ${side} palm captured`;

  addBeamOverlay(canvas);  // 🌈 add canvas beam overlay
  checkReady();
}

// === Add AI Beam Overlay inside Canvas ===
function addBeamOverlay(canvas) {
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createRadialGradient(
    canvas.width / 2, canvas.height / 2, 20,
    canvas.width / 2, canvas.height / 2, canvas.width / 1.2
  );
  gradient.addColorStop(0, "rgba(0,255,255,0.15)");
  gradient.addColorStop(0.5, "rgba(255,215,0,0.10)");
  gradient.addColorStop(1, "rgba(0,0,0,0.6)");
  ctx.globalCompositeOperation = "lighter";
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = "source-over";
}

// === Check both captured ===
function checkReady() {
  if (leftCaptured && rightCaptured) {
    document.getElementById("status").textContent =
      "🌟 Both palms captured – AI analyzing...";
    setTimeout(autoAnalyze, 2500);
  }
}

// === Auto Analyze (Simulated) ===
async function autoAnalyze() {
  const status = document.getElementById("status");
  status.textContent = "🤖 Buddhi AI analyzing both palms...";
  setTimeout(() => {
    status.textContent = "✨ AI Report Ready – Divine Energy Balanced 💫";
  }, 3000);
}

// === Button Bindings ===
document.getElementById("startCamLeft").onclick = () => startCam("left");
document.getElementById("startCamRight").onclick = () => startCam("right");
document.getElementById("captureLeft").onclick = () => capture("left");
document.getElementById("captureRight").onclick = () => capture("right");

initAI();
