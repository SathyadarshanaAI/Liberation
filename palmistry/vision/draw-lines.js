export function drawPalmLines(canvas, lines) {
  if (!canvas || !lines) return;

  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.lineWidth = 3;
  ctx.shadowBlur = 12;
  ctx.shadowColor = "cyan";

  const colors = {
    life: "#00eaff",
    head: "#ff0077",
    heart: "#ffcc00",
    fate: "#cc00ff",
    sun: "#ff6600",
    health: "#00ff88",
    marriage: "#ffaaee",
    manikanda: "#00ffff"
  };

  Object.keys(lines).forEach(lineName => {
    const linePoints = lines[lineName];
    if (!linePoints) return;

    ctx.strokeStyle = colors[lineName] || "#00eaff";
    ctx.beginPath();

    linePoints.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });

    ctx.stroke();
  });
}
