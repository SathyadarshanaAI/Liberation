import { drawPalm } from "./lines.js";

let detector;
let leftStream, rightStream;
let leftCaptured = false, rightCaptured = false;

// === 🧠 Initialize AI ===
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

// === 🎥 Start Camera (Force Back Camera) ===
async function startCam(side) {
  const vid = document.getElementById(side === "left" ? "vidLeft" : "vidRight");
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: "environment" }, // 🔙 Always back camera
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    });

    vid.srcObject = stream;
    if (side === "left") leftStream = stream; else rightStream = stream;

    document.getElementById("status").textContent = `📷 ${side} camera started`;
  } catch (err) {
    alert(`Please allow camera access for ${side} hand`);
    console.error(err);
  }
}

// === 📸 Capture and Freeze ===
function capture(side) {
  const vid = document.getElementById(side === "left" ? "vidLeft" : "vidRight");
  const canvas = document.getElementById(side === "left" ? "canvasLeft" : "canvasRight");
  const ctx = canvas.getContext("2d");

  // Draw captured frame
  ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);

  // Freeze preview
  vid.pause();

  // Stop stream
  const stream = side === "left" ? leftStream : rightStream;
  if (stream) stream.getTracks().forEach(t => t.stop());

  // Mark captured
  if (side === "left") leftCaptured = true;
  else rightCaptured = true;

  document.getElementById("status").textContent = `✅ ${side} palm captured`;

  checkReady();
}

// === 🔍 Check if both hands captured ===
function checkReady() {
  if (leftCaptured && rightCaptured) {
    document.getElementById("status").textContent =
      "🌟 Both palms captured – AI analyzing...";
    startBeamEffect();
    setTimeout(autoAnalyze, 2500);
  }
}

// === 🌈 Beam Animation ===
function startBeamEffect() {
  const beam = document.createElement("div");
  beam.style.position = "fixed";
  beam.style.top = 0;
  beam.style.left = 0;
  beam.style.width = "100%";
  beam.style.height = "100%";
  beam.style.zIndex = 9999;
  beam.style.pointerEvents = "none";
  beam.style.background =
    "radial-gradient(circle, rgba(0,255,255,0.2) 0%, rgba(0,0,0,0.85) 70%)";
  beam.style.animation = "beamPulse 2s infinite alternate";
  document.body.appendChild(beam);

  const style = document.createElement("style");
  style.textContent = `
    @keyframes beamPulse {
      from {opacity: 0.25; filter: blur(4px);}
      to {opacity: 0.7; filter: blur(12px);}
    }`;
  document.head.appendChild(style);
}

// === 🤖 Auto AI Analyze ===
async function autoAnalyze() {
  const status = document.getElementById("status");
  status.textContent = "🤖 Buddhi AI analyzing both palms...";

  // Simulated AI logic
  setTimeout(() => {
    status.textContent = "✨ AI Report Ready – Divine Energy Balanced 💫";
  }, 3000);
}

// === 🔘 Button Bindings ===
document.getElementById("startCamLeft").onclick = () => startCam("left");
document.getElementById("startCamRight").onclick = () => startCam("right");
document.getElementById("captureLeft").onclick = () => capture("left");
document.getElementById("captureRight").onclick = () => capture("right");

initAI();
