// 🌈 overlay.js — Quantum AI Overlay Drawer (V11.8 Stable)
export function drawAIOverlay(canvas, side = "left") {
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;

  ctx.save();
  ctx.clearRect(0, 0, w, h);
  ctx.globalAlpha = 0.95;

  // 🎨 Define color theme
  const color = side === "left" ? "#00e5ff" : "#ffcc33";
  ctx.strokeStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 25;
  ctx.lineWidth = 2.2;

  // ✋ Draw simplified palm energy lines
  ctx.beginPath();
  ctx.moveTo(w * 0.45, h * 0.9);
  ctx.quadraticCurveTo(w * 0.25, h * 0.55, w * 0.4, h * 0.2); // Life Line

  ctx.moveTo(w * 0.35, h * 0.4);
  ctx.lineTo(w * 0.75, h * 0.3); // Heart Line

  ctx.moveTo(w * 0.4, h * 0.3);
  ctx.lineTo(w * 0.7, h * 0.5); // Head Line

  ctx.moveTo(w * 0.55, h * 0.9);
  ctx.lineTo(w * 0.55, h * 0.1); // Fate Line
  ctx.stroke();

  // 🌌 Add aura glow background
  const grad = ctx.createRadialGradient(w / 2, h / 2, 50, w / 2, h / 2, 220);
  grad.addColorStop(0, `${color}40`);
  grad.addColorStop(1, "transparent");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  ctx.restore();
  console.log(`✨ AI Overlay drawn successfully for ${side} hand`);
}
