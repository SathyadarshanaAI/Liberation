// 🌈 overlay.js — Quantum AI Overlay Drawer
export function drawAIOverlay(canvas, side = "left") {
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;

  // Clear any old overlay
  ctx.save();
  ctx.globalAlpha = 0.9;
  ctx.clearRect(0, 0, w, h);

  // Line color theme (left = blue / right = gold)
  const color = side === "left" ? "#00e5ff" : "#ffcc33";

  // Add soft glowing border
  ctx.shadowColor = color;
  ctx.shadowBlur = 20;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.2;

  // Simulated palm energy pattern
  ctx.beginPath();
  ctx.moveTo(w * 0.5, h * 0.9);
  ctx.quadraticCurveTo(w * 0.3, h * 0.6, w * 0.4, h * 0.2); // Life line
  ctx.moveTo(w * 0.4, h * 0.2);
  ctx.lineTo(w * 0.7, h * 0.35); // Head line
  ctx.moveTo(w * 0.3, h * 0.4);
  ctx.lineTo(w * 0.8, h * 0.25); // Heart line
  ctx.moveTo(w * 0.6, h * 0.7);
  ctx.lineTo(w * 0.55, h * 0.1); // Fate line
  ctx.stroke();

  // Soft aura glow
  const grad = ctx.createRadialGradient(w / 2, h / 2, 50, w / 2, h / 2, 250);
  grad.addColorStop(0, `${color}30`);
  grad.addColorStop(1, "transparent");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  ctx.restore();
  console.log(`✨ AI Overlay drawn for ${side} hand`);
}
