// overlay.js — Quantum Line Mapper v11.8
export function drawAIOverlay(canvas, side = "left") {
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;

  // semi-randomized curvature simulation for now
  const rand = n => Math.sin(Date.now() / 1000 + n) * 0.2 + 0.5;

  // helper
  const curve = (x1, y1, x2, y2, color, width = 2) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.quadraticCurveTo((x1 + x2) / 2, (y1 + y2) / 2 - 30, x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
    ctx.stroke();
  };

  // clear overlay first
  ctx.clearRect(0, 0, w, h);

  // 🌿 Life line
  curve(w * 0.2, h * (0.8 - rand(1)), w * 0.6, h * 0.95, "#16f0a7", 3);

  // ❤️ Heart line
  curve(w * 0.3, h * (0.5 - rand(2)), w * 0.8, h * 0.45, "#ff4081", 2.5);

  // 🔮 Fate line
  curve(w * 0.5, h * (0.2 + rand(3)), w * 0.55, h * 0.9, "#00e5ff", 2);

  // ☀️ Sun line
  curve(w * 0.7, h * (0.3 + rand(4)), w * 0.85, h * 0.8, "#ffcc00", 2);

  // 🪷 Mana Line
  curve(w * 0.4, h * 0.25, w * 0.75, h * (0.75 + rand(5)), "#d1aaff", 1.5);

  // 💫 label
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#00e5ff";
  ctx.font = "14px Segoe UI";
  ctx.fillText(side === "left" ? "← AI Line Overlay (Past)" : "AI Line Overlay (Future) →", 10, 20);
}
