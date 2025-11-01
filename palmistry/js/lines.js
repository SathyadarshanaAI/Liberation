// lines.js — V18.5 Buddhi Vision Stroke Mapping Edition
export function drawPalm(ctx) {
  const w = ctx.canvas.width, h = ctx.canvas.height;
  ctx.shadowBlur = 8;

  const lines = [
    { n: "Life", p: [[w*0.35,h*0.85],[w*0.25,h*0.65],[w*0.20,h*0.45],[w*0.30,h*0.25]], color:"#FFD700", thick:3.0 },
    { n: "Head", p: [[w*0.20,h*0.55],[w*0.50,h*0.45],[w*0.85,h*0.48]], color:"#00FFFF", thick:2.0 },
    { n: "Heart", p: [[w*0.25,h*0.35],[w*0.55,h*0.30],[w*0.85,h*0.28]], color:"#FF69B4", thick:2.2 },
    { n: "Fate", p: [[w*0.50,h*0.95],[w*0.50,h*0.60],[w*0.48,h*0.25]], color:"#16F0A7", thick:2.5 },
    { n: "Sun", p: [[w*0.70,h*0.90],[w*0.72,h*0.55],[w*0.72,h*0.25]], color:"#FFA500", thick:1.8 },
    { n: "Health", p: [[w*0.65,h*0.85],[w*0.55,h*0.55],[w*0.35,h*0.35]], color:"#00FF66", thick:1.4 },
    { n: "Marriage", p: [[w*0.75,h*0.22],[w*0.85,h*0.20]], color:"#FFB6C1", thick:1.2 },
    // ✨ unidentified / cross marks
    { n: "Unknown", p: [[w*0.40,h*0.60],[w*0.60,h*0.40]], color:"#00BFFF", thick:1.0, dashed:true }
  ];

  for (const l of lines) {
    ctx.beginPath();
    ctx.strokeStyle = l.color;
    ctx.lineWidth = l.thick;
    if (l.dashed) ctx.setLineDash([6,4]); else ctx.setLineDash([]);
    const [start, ...rest] = l.p;
    ctx.moveTo(start[0], start[1]);
    for (const p of rest) ctx.lineTo(p[0], p[1]);
    ctx.stroke();
  }

  // 🕊️ Aura effect overlay
  ctx.globalAlpha = 0.2;
  ctx.fillStyle = "#16f0a722";
  ctx.beginPath();
  ctx.ellipse(w*0.5,h*0.55,w*0.45,h*0.35,0,0,2*Math.PI);
  ctx.fill();
  ctx.globalAlpha = 1;

  // Label annotations
  ctx.font = "12px 'Segoe UI'";
  ctx.fillStyle = "#00e5ff";
  for (const l of lines) {
    const [x,y] = l.p[Math.floor(l.p.length/2)];
    ctx.fillText(l.n, x+4, y-6);
  }
}
