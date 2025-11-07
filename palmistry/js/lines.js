// lines.js — V21.9 Animated Glow Edition (used for 2D canvas overlay)
export function drawPalm(ctx) {
  if (!ctx) return;

  const w = ctx.canvas.width;
  const h = ctx.canvas.height;

  const lines = [
    { name: "Life", color: "#00E5C3", p: [[w*0.25,h*0.85],[w*0.1,h*0.45],[w*0.45,h*0.75]] },
    { name: "Head", color: "#00CFFF", p: [[w*0.2,h*0.55],[w*0.55,h*0.4],[w*0.85,h*0.45]] },
    { name: "Heart", color: "#FF7AB6", p: [[w*0.25,h*0.4],[w*0.55,h*0.3],[w*0.85,h*0.25]] },
    { name: "Fate", color: "#7CFFB2", p: [[w*0.5,h*0.95],[w*0.55,h*0.6],[w*0.5,h*0.15]] },
    { name: "Sun", color: "#FFB86B", p: [[w*0.7,h*0.9],[w*0.75,h*0.6],[w*0.8,h*0.25]] },
    { name: "Health", color: "#FF6A4D", p: [[w*0.15,h*0.9],[w*0.4,h*0.55]] },
    { name: "Manikanda", color: "#64FFE3", p: [[w*0.45,h*0.9],[w*0.5,h*0.6],[w*0.55,h*0.3]] }
  ];

  ctx.save();
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.95;

  // ✨ Simple pulsing glow animation (subtle)
  const t = Date.now() / 600;

  lines.forEach(line => {
    const glow = 6 + Math.sin(t) * 3;
    ctx.strokeStyle = line.color;
    ctx.shadowColor = line.color;
    ctx.shadowBlur = glow;

    ctx.beginPath();
    ctx.moveTo(line.p[0][0], line.p[0][1]);
    for (let i = 1; i < line.p.length; i++) {
      ctx.lineTo(line.p[i][0], line.p[i][1]);
    }
    ctx.stroke();

    // === Label text ===
    const last = line.p[line.p.length - 1];
    ctx.font = "12px Segoe UI";
    ctx.shadowBlur = 0;
    ctx.fillStyle = line.color;
    ctx.fillText(line.name, last[0] + 6, last[1] - 6);
  });

  ctx.restore();

  // 🔁 Optional: small flicker update for "living" palm effect
  requestAnimationFrame(() => drawPalm(ctx));
}
