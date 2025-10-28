// 🌈 overlay.js — Quantum AI Overlay Drawer (V11.8 Stable)
export function drawAIOverlay(canvas, side = "left") {
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;

  ctx.save();
  ctx.clearRect(0, 0, w, h);
  ctx.globalAlpha = 0.9;

  const color = side === "left" ? "#00e5ff" : "#ffcc33";
  ctx.strokeStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 20;
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(w * 0.45, h * 0.9);
  ctx.quadraticCurveTo(w * 0.25, h * 0.55, w * 0.4, h * 0.2); // Life line
  ctx.moveTo(w * 0.35, h * 0.4);
  ctx.lineTo(w * 0.75, h * 0.3); // Heart line
  ctx.moveTo(w * 0.4, h * 0.3);
  ctx.lineTo(w * 0.7, h * 0.5); // Head line
  ctx.moveTo(w * 0.55, h * 0.9);
  ctx.lineTo(w * 0.55, h * 0.1); // Fate line
  ctx.stroke();

  const grad = ctx.createRadialGradient(w / 2, h / 2, 60, w / 2, h / 2, 260);
  grad.addColorStop(0, `${color}30`);
  grad.addColorStop(1, "transparent");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  ctx.restore();
  console.log(`✨ AI overlay drawn successfully for ${side} hand`);
}
