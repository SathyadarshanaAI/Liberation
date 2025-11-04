// 🕉️ Sathyadarshana Quantum Palm Analyzer · V19.1 Stable Real AI Detection Edition
import { drawPalm } from "./lines.js";

let detector, videoEl;

// === Initialize AI Model ===
async function initAI() {
  try {
    const model = handPoseDetection.SupportedModels.MediaPipeHands;
    const detectorConfig = {
      runtime: "tfjs",
      modelType: "lite",
      maxHands: 1,
    };
    detector = await handPoseDetection.createDetector(model, detectorConfig);
    console.log("✅ AI Palm Detector Ready");
    document.getElementById("status").textContent = "✅ AI Palm Detector Ready";
  } catch (err) {
    console.error("❌ Error loading AI model:", err);
    document.getElementById("status").textContent = "❌ AI model load failed";
  }
}

// === Start Camera (Rear) ===
async function startCam() {
  videoEl = document.getElementById("vidRight");
  if (!videoEl) return console.error("Video element not found");

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: "environment" }, // use back camera
        width: { ideal: 640 },
        height: { ideal: 480 },
      },
      audio: false,
    });
    videoEl.srcObject = stream;
    await videoEl.play();
    console.log("🎥 Camera started successfully");
    document.getElementById("status").textContent = "🎥 Camera started";
    requestAnimationFrame(detectHand);
  } catch (err) {
    console.error("❌ Camera error:", err);
    alert("⚠️ Camera access failed. Please check permissions or refresh page.");
    document.getElementById("status").textContent = "❌ Camera access failed";
  }
}

// === Detect Hand & Draw Palm ===
async function detectHand() {
  if (!detector || !videoEl) return;
  try {
    const predictions = await detector.estimateHands(videoEl);
    const canvas = document.getElementById("canvasRight");
    const ctx = canvas.getContext("2d");

    // Clear & draw video
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);

    if (predictions.length > 0) {
      const keypoints = predictions[0].keypoints;
      ctx.strokeStyle = "#00e5ff";
      ctx.lineWidth = 2;
      ctx.shadowColor = "#16f0a7";
      ctx.shadowBlur = 10;

      // --- Palm Contour ---
      const wrist = keypoints[0];
      const indexBase = keypoints[5];
      const pinkyBase = keypoints[17];
      ctx.beginPath();
      ctx.moveTo(wrist.x, wrist.y);
      ctx.lineTo(indexBase.x, indexBase.y);
      ctx.lineTo(pinkyBase.x, pinkyBase.y);
      ctx.closePath();
      ctx.stroke();

      // --- Dynamic Palm Lines ---
      drawPalm(ctx, keypoints);
    } else {
      document.getElementById("status").textContent = "🖐️ Place your hand clearly in view";
    }
  } catch (err) {
    console.error("⚠️ Detection error:", err);
  }
  requestAnimationFrame(detectHand);
}

// === Capture Snapshot ===
async function capturePalm() {
  const canvas = document.getElementById("canvasRight");
  const img = canvas.toDataURL("image/png");
  localStorage.setItem("palmRight", img);
  document.getElementById("status").textContent = "📸 Palm captured and saved";
}

// === Auto Start on Load ===
document.addEventListener("DOMContentLoaded", async () => {
  await initAI();
  await startCam();

  const captureBtn = document.getElementById("captureRight");
  if (captureBtn) captureBtn.onclick = capturePalm;
});
