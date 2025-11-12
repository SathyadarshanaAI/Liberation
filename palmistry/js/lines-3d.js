// ===============================
// 🌌 lines-3d.js · V30.0 Divyachakra Real Palm Mode
// ===============================

// Load TensorFlow Handpose model
import * as handpose from "https://cdn.jsdelivr.net/npm/@tensorflow-models/handpose@0.0.7/dist/handpose.min.js";
import "@tensorflow/tfjs-backend-webgl";

let model = null;

// Initialize model once
export async function initHandModel() {
  if (!model) {
    model = await handpose.load();
    console.log("🤖 Divyachakra Model Loaded");
  }
  return model;
}

// Main real 3D render function
export async function renderPalmLines3D(frame, canvas) {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Convert frame to image
  const imageBitmap = await createImageBitmap(new ImageData(frame.data, frame.width, frame.height));

  // Draw base palm
  ctx.drawImage(imageBitmap, 0, 0, canvas.width, canvas.height);

  // Load model
  const handposeModel = await initHandModel();
  const predictions = await handposeModel.estimateHands(imageBitmap, true);

  // If no hands detected
  if (!predictions.length) {
    ctx.fillStyle = "#FFD700";
    ctx.font = "14px Segoe UI";
    ctx.fillText("Adjust camera closer to palm 🖐️", 20, canvas.height - 10);
    return;
  }

  // For each detected hand
  predictions.forEach((hand) => {
    const landmarks = hand.landmarks;

    // 🔮 Draw detected points (21 keypoints)
    ctx.fillStyle = "#00e5ff";
    for (let [x, y] of landmarks) {
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, 2 * Math.PI);
      ctx.fill();
    }

    // 🔮 Draw realistic glowing palm lines based on keypoint clusters
    drawGlowLine(ctx, [landmarks[0], landmarks[1], landmarks[5], landmarks[9], landmarks[13]], "#00e5ff", "Life Line");
    drawGlowLine(ctx, [landmarks[5], landmarks[9], landmarks[13], landmarks[17]], "#ff4081", "Heart Line");
    drawGlowLine(ctx, [landmarks[0], landmarks[9], landmarks[13]], "#ffc107", "Head Line");
    drawGlowLine(ctx, [landmarks[9], landmarks[0]], "#7c4dff", "Fate Line");
    drawGlowLine(ctx, [landmarks[13], landmarks[17]], "#4caf50", "Health Line");
  });
}

function drawGlowLine(ctx, points, color, label) {
  const grad = ctx.createLinearGradient(points[0][0], points[0][1], points[points.length - 1][0], points[points.length - 1][1]);
  grad.addColorStop(0, color);
  grad.addColorStop(1, "#ffffff");

  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
  ctx.strokeStyle = grad;
  ctx.lineWidth = 3;
  ctx.shadowBlur = 10;
  ctx.shadowColor = color;
  ctx.stroke();
  ctx.closePath();

  // Label
  const mid = points[Math.floor(points.length / 2)];
  ctx.font = "12px Segoe UI";
  ctx.fillStyle = color;
  ctx.fillText(label, mid[0] + 5, mid[1] - 5);
}
