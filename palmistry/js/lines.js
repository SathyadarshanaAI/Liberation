// lines.js — V19.0 Buddhi Vision Color Overlay Blend Edition
export function drawPalm(ctx) {
  const w = ctx.canvas.width, h = ctx.canvas.height;

  // 👁️ transparent overlay look
  ctx.save();
  ctx.globalAlpha = 0.55;      // 🩵 semi-transparent lines
  ctx.shadowBlur = 10;
  ctx.shadowColor = "#00ffff99";

  const lines = [
    { n: "Life", color: "#FFD700", path: [[w*0.32,h*0.85],[w*0.25,h*0.65],[w*0.22,h*0.45],[w*0.30,h*0.25]], width: 2.8 },
    { n: "Head", color: "#00FFFF", path: [[w*0.20,h*0.55],[w*0.50,h*0.45],[w*0.82,h*0.48]], width: 2.2 },
    { n: "Heart", color: "#FF69B4", path: [[w*0.25,h*0.35],[w*0.55,h*0.30],[w*0.85,h*0.28]], width: 2.4 },
    { n: "Fate", color: "#16F0A7", path: [[w*0.50,h*0.95],[w*0.50,h*0.60],[w*0.48,h*0.25]], width: 2.4 },
    { n: "Sun", color: "#FFA500", path: [[w*0.70,h*0.90],[w*0.72,h*0.55],[w*0.72,h*0.25]], width: 2.0 },
    { n: "Health", color: "#00FF66", path: [[w*0.65,h*0.85],[w*0.55,h*0.55],[w*0.35,h*0.35]], width: 1.5 },
    { n: "Marriage", color: "#FFB6C1", path: [[w*0.75,h*0.22],[w*0.85,h*0.20]], width: 1.2 },
    { n: "Unknown", color: "#00BFFF", path: [[w*0.40,h*0.60],[w*0.58,h*0.42]], width: 1.0, dash:[5,4] }
  ];

  for (const ln of lines) {
    ctx.beginPath();
    ctx.strokeStyle = ln.color;
    ctx.lineWidth = ln.width;
    if (ln.dash) ctx.setLineDash(ln.dash); else ctx.setLineDash([]);
    const [start, ...rest] = ln.path;
    ctx.moveTo(start[0], start[1]);
    rest.forEach(p => ctx.lineTo(p[0], p[1]));
    ctx.stroke();
  }

  // Label (soft glow)
  ctx.shadowBlur = 0;
  ctx.globalAlpha = 0.75;
  ctx.font = "12px 'Segoe UI'";
  ctx.fillStyle = "#aefaff";
  for (const ln of lines) {
    const mid = ln.path[Math.floor(ln.path.length/2)];
    ctx.fillText(ln.n, mid[0]+4, mid[1]-4);
  }

  ctx.restore();
}
