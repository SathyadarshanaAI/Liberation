// main.js — V19.0 Real AI Detection Edition
import { drawPalm } from "./lines.js";

let detector, videoEl;

async function initAI() {
  const model = handPoseDetection.SupportedModels.MediaPipeHands;
  const detectorConfig = {
    runtime: "tfjs",
    modelType: "lite",
  };
  detector = await handPoseDetection.createDetector(model, detectorConfig);
  console.log("✅ AI Palm Detector Ready");
}

async function startCam() {
  videoEl = document.getElementById("vidRight");
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  videoEl.srcObject = stream;
  videoEl.play();
  requestAnimationFrame(detectHand);
}

async function detectHand() {
  if (!detector || !videoEl) return;
  const predictions = await detector.estimateHands(videoEl);
  const canvas = document.getElementById("canvasRight");
  const ctx = canvas.getContext("2d");
  ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);

  if (predictions.length > 0) {
    const keypoints = predictions[0].keypoints3D || predictions[0].keypoints;
    ctx.strokeStyle = "#00e5ff";
    ctx.lineWidth = 2;

    // palm base points
    const palmBase = keypoints[0];
    const indexBase = keypoints[5];
    const pinkyBase = keypoints[17];
    const middleTip = keypoints[12];
    const wrist = keypoints[0];

    // connect major palm lines dynamically
    ctx.beginPath();
    ctx.moveTo(wrist.x, wrist.y);
    ctx.lineTo(indexBase.x, indexBase.y);
    ctx.lineTo(middleTip.x, middleTip.y);
    ctx.lineTo(pinkyBase.x, pinkyBase.y);
    ctx.lineTo(wrist.x, wrist.y);
    ctx.stroke();

    // glowing aura
    ctx.shadowColor = "#16f0a7";
    ctx.shadowBlur = 25;
    ctx.stroke();

    // dynamic AI line mapping
    drawPalm(ctx, keypoints);
  }
  requestAnimationFrame(detectHand);
}

document.addEventListener("DOMContentLoaded", async () => {
  await initAI();
  startCam();
});
