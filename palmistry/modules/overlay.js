// overlay.js — Quantum Line Mapper v11.8
export function drawAIOverlay(canvas, side = "left") {
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;

  // clear overlay first
  ctx.clearRect(0, 0, w, h);

  // simple helper
  const curve = (x1, y1, x2, y2, color, width = 2) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.quadraticCurveTo((x1 + x2) / 2, (y1 + y2) / 2 - 30, x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.shadowColor = color;
    ctx.shadowBlur = 8;
    ctx.stroke();
  };

  // 🫱 major lines
  curve(w * 0.2, h * 0.8, w * 0.6, h * 0.95, "#16f0a7", 3); // life line
  curve(w * 0.3, h * 0.55, w * 0.85, h * 0.45, "#ff4081", 2.5); // heart line
  curve(w * 0.5, h * 0.2, w * 0.55, h * 0.9, "#00e5ff", 2); // fate line

  ctx.shadowBlur = 0;
  ctx.fillStyle = "#00e5ff";
  ctx.font = "14px Segoe UI";
  ctx.fillText(
    side === "left" ? "← AI Overlay (Past hand)" : "AI Overlay (Future hand) →",
    10,
    20
  );
}
