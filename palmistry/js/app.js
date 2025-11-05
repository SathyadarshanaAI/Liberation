// 🕉️ Sathyadarshana Quantum Palm Analyzer · V20.0 TrueScan Base
import { drawPalm } from "./lines.js";

let detector;
let activeSide = null;

// === AI Model Initialization ===
async function initAI() {
  const status = document.getElementById("status");
  status.textContent = "🧠 Loading AI Modules...";
  try {
    const model = handPoseDetection.SupportedModels.MediaPipeHands;
    const config = { runtime: "tfjs", modelType: "lite", maxHands: 1 };
    detector = await handPoseDetection.createDetector(model, config);
    console.log("✅ AI Buddhi Model Ready");
    status.textContent = "✅ AI Buddhi Ready for Scanning";
  } catch (e) {
    console.error("❌ Failed to initialize AI model:", e);
    status.textContent = "⚠️ Error loading AI model";
  }
}

// === Warmup Camera ===
async function warmupCamera() {
  try {
    const test = await navigator.mediaDevices.getUserMedia({ video: true });
    test.getTracks().forEach(t => t.stop());
    console.log("⚡ Camera warmup complete");
  } catch (err) {
    console.warn("⚠️ Warmup camera failed:", err);
  }
}

// === Start Camera ===
async function startCam(side) {
  activeSide = side;
  const vid = document.getElementById(side === "left" ? "vidLeft" : "vidRight");
  const status = document.getElementById("status");

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: side === "right" ? "user" : "environment" },
      audio: false,
    });
    vid.srcObject = stream;
    await vid.play();
    console.log(`🎥 ${side} camera started`);
    status.textContent = `🎥 ${side.toUpperCase()} Camera Active`;
    detectHand(side);
  } catch (err) {
    console.error(`❌ ${side} camera error:`, err);
    alert(`Please allow camera access for ${side} hand`);
  }
}

// === Detect Hand & Overlay ===
async function detectHand(side) {
  if (!detector) return;
  const vid = document.getElementById(side === "left" ? "vidLeft" : "vidRight");
  const canvas = document.getElementById(side === "left" ? "canvasLeft" : "canvasRight");
  const ctx = canvas.getContext("2d");

  try {
    const hands = await detector.estimateHands(vid);
    ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);

    if (hands.length > 0) {
      const keypoints = hands[0].keypoints;
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#00e5ff";
      drawPalm(ctx, keypoints);
    }
  } catch (e) {
    console.warn(`⚠️ Detection (${side}) failed:`, e);
  }

  requestAnimationFrame(() => detectHand(side));
}

// === Capture ===
function capture(side) {
  const canvas = document.getElementById(side === "left" ? "canvasLeft" : "canvasRight");
  const dataURL = canvas.toDataURL("image/png");
  localStorage.setItem(`palm_${side}`, dataURL);
  document.getElementById("status").textContent = `📸 ${side} palm captured`;
  console.log(`💾 Saved ${side} palm image`);
}

// === Initialize ===
document.addEventListener("DOMContentLoaded", async () => {
  await warmupCamera();
  await initAI();

  document.getElementById("startCamLeft").onclick = () => startCam("left");
  document.getElementById("startCamRight").onclick = () => startCam("right");
  document.getElementById("captureLeft").onclick = () => capture("left");
  document.getElementById("captureRight").onclick = () => capture("right");
});

export { startCam, capture };
