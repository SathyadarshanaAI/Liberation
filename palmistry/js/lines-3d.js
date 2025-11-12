// ===============================
// 🌌 lines-3d.js · V30.1 Divyachakra Real Palm Mode (Browser fixed)
// ===============================

// ✅ Import TensorFlow + Handpose via CDN
import * as tf from "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.10.0/dist/tf.min.js";
import * as handpose from "https://cdn.jsdelivr.net/npm/@tensorflow-models/handpose@0.0.7/dist/handpose.min.js";

let model = null;

// 🧠 Initialize model (with WebGL backend auto)
export async function initHandModel() {
  if (!model) {
    await tf.setBackend("webgl"); // auto switch
    await tf.ready();
    model = await handpose.load();
    console.log("🤖 Divyachakra Model Loaded with WebGL backend");
  }
  return model;
}

// 🌈 Main render function
export async function renderPalmLines3D(frame, canvas) {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 🖐 Convert frame to image
  const img = new ImageData(frame.data, frame.width, frame.height);
  const bitmap = await createImageBitmap(img);

  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

  const handposeModel = await initHandModel();
  const predictions = await handposeModel.estimateHands(bitmap, true);

  if (!predictions.length) {
    ctx.fillStyle = "#FFD700";
    ctx.font = "14px Segoe UI";
    ctx.fillText("Place your palm closer 🖐️", 40, canvas.height - 10);
    return;
  }

  // 🪶 Draw detected points + glowing lines
  predictions.forEach((hand) => {
    const points = hand.landmarks;
    ctx.fillStyle = "#00e5ff";
    points.forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw core lines
    drawGlowLine(ctx, [points[0], points[1], points[5], points[9]], "#ff4081", "Heart Line");
    drawGlowLine(ctx, [points[0], points[5], points[9], points[13]], "#00e5ff", "Life Line");
    drawGlowLine(ctx, [points[9], points[13], points[17]], "#ffc107", "Head Line");
    drawGlowLine(ctx, [points[0], points[9], points[17]], "#4caf50", "Fate Line");
    drawGlowLine(ctx, [points[13], points[17]], "#ff9800", "Health Line");
  });
}

function drawGlowLine(ctx, pts, color, label) {
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.shadowBlur = 10;
  ctx.shadowColor = color;
  ctx.stroke();

  const mid = pts[Math.floor(pts.length / 2)];
  ctx.font = "12px Segoe UI";
  ctx.fillStyle = color;
  ctx.fillText(label, mid[0] + 5, mid[1] - 5);
}
