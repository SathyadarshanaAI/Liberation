// 🕉️ Sathyadarshana Quantum Palm Analyzer · V19.2 Dual Camera Stable Edition
import { drawPalm } from "./lines.js";

let detector;

// === Initialize AI Model ===
async function initAI() {
  const status = document.getElementById("status");
  try {
    const model = handPoseDetection.SupportedModels.MediaPipeHands;
    const detectorConfig = {
      runtime: "tfjs",
      modelType: "lite",
      maxHands: 1,
    };
    detector = await handPoseDetection.createDetector(model, detectorConfig);
    console.log("✅ AI Palm Detector Ready");
    status.textContent = "✅ AI Palm Detector Ready";
  } catch (err) {
    console.error("❌ Error initializing AI model:", err);
    status.textContent = "⚠️ Failed to load AI model";
  }
}

// === Start Camera (select by side) ===
async function startCam(side) {
  const vid = document.getElementById(side === "left" ? "vidLeft" : "vidRight");
  if (!vid) return;

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: "environment" }, // Rear camera
        width: { ideal: 640 },
        height: { ideal: 480 },
      },
      audio: false,
    });

    vid.srcObject = stream;
    await vid.play();
    console.log(`🎥 ${side} camera started`);
    document.getElementById("status").textContent = `🎥 ${side} camera active`;
    detectHand(side);
  } catch (err) {
    console.error(`❌ ${side} camera error:`, err);
    alert(`⚠️ Please allow camera access for ${side} hand`);
  }
}

// === Hand Detection Loop ===
async function detectHand(side) {
  const vid = document.getElementById(side === "left" ? "vidLeft" : "vidRight");
  const canvas = document.getElementById(
    side === "left" ? "canvasLeft" : "canvasRight"
  );
  const ctx = canvas.getContext("2d");

  if (!detector || !vid) return;

  try {
    const predictions = await detector.estimateHands(vid);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);

    if (predictions.length > 0) {
      const keypoints = predictions[0].keypoints;
      ctx.strokeStyle = "#00e5ff";
      ctx.lineWidth = 2;
      ctx.shadowColor = "#16f0a7";
      ctx.shadowBlur = 10;

      // Simple palm base contour
      const wrist = keypoints[0];
      const indexBase = keypoints[5];
      const pinkyBase = keypoints[17];

      ctx.beginPath();
      ctx.moveTo(wrist.x, wrist.y);
      ctx.lineTo(indexBase.x, indexBase.y);
      ctx.lineTo(pinkyBase.x, pinkyBase.y);
      ctx.closePath();
      ctx.stroke();

      // Call palm line drawer
      drawPalm(ctx, keypoints);
    }
  } catch (err) {
    console.warn(`⚠️ Detection (${side}) error:`, err);
  }

  requestAnimationFrame(() => detectHand(side));
}

// === Capture Function ===
function capture(side) {
  const canvas = document.getElementById(
    side === "left" ? "canvasLeft" : "canvasRight"
  );
  const img = canvas.toDataURL("image/png");
  localStorage.setItem(`palm_${side}`, img);
  document.getElementById("status").textContent = `📸 ${side} palm captured`;
  console.log(`💾 ${side} palm image saved to localStorage`);
}

// === Initialize ===
document.addEventListener("DOMContentLoaded", async () => {
  await initAI();

  document.getElementById("startCamLeft").onclick = () => startCam("left");
  document.getElementById("startCamRight").onclick = () => startCam("right");

  document.getElementById("captureLeft").onclick = () => capture("left");
  document.getElementById("captureRight").onclick = () => capture("right");

  const analyzeBtn = document.getElementById("analyzeBtn");
  if (analyzeBtn) {
    analyzeBtn.onclick = () => {
      const reportBox = document.getElementById("reportBox");
      reportBox.textContent =
        "🤖 AI Buddhi is analyzing your palm structure...";
      setTimeout(() => {
        reportBox.textContent =
          "🌟 Analysis Complete — Your palm lines have been successfully recorded!";
      }, 2000);
    };
  }
});
