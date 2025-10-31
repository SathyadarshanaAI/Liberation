// ✋ drawPalm.js — Core Palm Line Drawer (8 major lines)

export function drawPalm(ctx) {
  const w = ctx.canvas.width, h = ctx.canvas.height;
  const fx = w / 500, fy = h / 800;

  const lines = [
    { n: "Life", p: [[120*fx,700*fy],[60*fx,400*fy],[220*fx,650*fy]], c: "#FFD700" },
    { n: "Head", p: [[100*fx,500*fy],[300*fx,400*fy],[420*fx,420*fy]], c: "#00FFFF" },
    { n: "Heart", p: [[120*fx,360*fy],[300*fx,300*fy],[420*fx,280*fy]], c: "#FF69B4" },
    { n: "Fate", p: [[250*fx,780*fy],[270*fx,500*fy],[250*fx,150*fy]], c: "#00FF99" },
    { n: "Sun", p: [[350*fx,750*fy],[370*fx,500*fy],[400*fx,200*fy]], c: "#FFA500" },
    { n: "Health", p: [[150*fx,580*fy],[400*fx,480*fy]], c: "#00FFFF" },
    { n: "Marriage", p: [[350*fx,250*fy],[400*fx,230*fy]], c: "#FF1493" },
    { n: "Manikanda", p: [[220*fx,600*fy],[300*fx,450*fy],[380*fx,320*fy]], c: "#FFFF00" },
  ];

  ctx.lineWidth = 2.4;
  ctx.shadowBlur = 8;

  for (const ln of lines) {
    ctx.beginPath();
    ctx.shadowColor = ln.c;
    ctx.strokeStyle = ln.c;
    const [start, ...rest] = ln.p;
    ctx.moveTo(...start);
    for (const pt of rest) ctx.lineTo(...pt);
    ctx.stroke();
  }

  ctx.font = `${12*fx}px Segoe UI`;
  ctx.fillStyle = "#16f0a7";
  for (const ln of lines) {
    const [x, y] = ln.p[Math.floor(ln.p.length / 2)];
    ctx.fillText(ln.n, x + 5, y - 4);
  }
}
