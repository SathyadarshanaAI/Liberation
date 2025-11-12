// ===============================
// 🌌 lines-3d.js · V30.2 Serenity Stable Edition
// ===============================

// ✅ Import TensorFlow + Handpose via CDN (only once)
import * as tf from "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.10.0/dist/tf.esm.min.js";
import * as handpose from "https://cdn.jsdelivr.net/npm/@tensorflow-models/handpose@0.0.7/dist/handpose.min.js";

let model = null;
let backendReady = false;

// 🧠 Initialize model safely
export async function initHandModel() {
  if (!backendReady) {
    try {
      await tf.setBackend("webgl");
      await tf.ready();
      backendReady = true;
      console.log("✅ TensorFlow WebGL backend ready");
    } catch (e) {
      console.warn("⚠️ WebGL backend issue, using CPU fallback");
      await tf.setBackend("cpu");
      await tf.ready();
    }
  }

  if (!model) {
    model = await handpose.load();
    console.log("🤖 Divyachakra Handpose Model Loaded (Single Instance)");
  }

  return model;
}

// 🌈 Main Palm Analyzer + Drawer
export async function renderPalmLines3D(frame, canvas) {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const img = new ImageData(frame.data, frame.width, frame.height);
  const bitmap = await createImageBitmap(img);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

  const handposeModel = await initHandModel();
  const predictions = await handposeModel.estimateHands(bitmap, true);

  if (!predictions.length) {
    ctx.fillStyle = "#FFD700";
    ctx.font = "14px Segoe UI";
    ctx.fillText("Place your palm closer 🖐️", 30, canvas.height - 12);
    return;
  }

  predictions.forEach((hand) => {
    const pts = hand.landmarks;
    ctx.fillStyle = "#00e5ff";
    pts.forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    });

    // 3D-style glowing palm lines (5 core lines)
    drawGlowLine(ctx, [pts[0], pts[1], pts[5], pts[9]], "#ff4081", "Heart Line");
    drawGlowLine(ctx, [pts[0], pts[5], pts[9], pts[13]], "#00e5ff", "Life Line");
    drawGlowLine(ctx, [pts[9], pts[13], pts[17]], "#ffc107", "Head Line");
    drawGlowLine(ctx, [pts[0], pts[9], pts[17]], "#4caf50", "Fate Line");
    drawGlowLine(ctx, [pts[13], pts[17]], "#ff9800", "Health Line");
  });
}

// ✨ Helper for glowing line drawing
function drawGlowLine(ctx, pts, color, label) {
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.2;
  ctx.shadowBlur = 12;
  ctx.shadowColor = color;
  ctx.stroke();

  const mid = pts[Math.floor(pts.length / 2)];
  ctx.font = "12px Segoe UI";
  ctx.fillStyle = color;
  ctx.fillText(label, mid[0] + 5, mid[1] - 5);
}
