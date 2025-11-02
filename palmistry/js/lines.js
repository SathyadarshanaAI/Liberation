// js/lines.js — V17.6 Stable Overlay Fix Edition
export function drawPalm(ctx) {
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;

  const lines = [
    { name: "Life", color: "#FFD700", width: 2, pts: [[w*0.25,h*0.85],[w*0.10,h*0.45],[w*0.40,h*0.75]] },
    { name: "Head", color: "#00FFFF", width: 1.8, pts: [[w*0.20,h*0.55],[w*0.55,h*0.40],[w*0.80,h*0.45]] },
    { name: "Heart", color: "#FF69B4", width: 2, pts: [[w*0.25,h*0.40],[w*0.55,h*0.30],[w*0.85,h*0.25]] },
    { name: "Fate", color: "#00FF7F", width: 2, pts: [[w*0.50,h*0.95],[w*0.55,h*0.60],[w*0.52,h*0.20]] },
    { name: "Sun", color: "#FFA500", width: 1.6, pts: [[w*0.70,h*0.90],[w*0.75,h*0.60],[w*0.72,h*0.25]] },
    { name: "Health", color: "#00CED1", width: 1.4, pts: [[w*0.45,h*0.85],[w*0.70,h*0.60]] },
    { name: "Marriage", color: "#FFC0CB", width: 1.2, pts: [[w*0.80,h*0.28],[w*0.90,h*0.25]] }
  ];

  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  for (const ln of lines) {
    ctx.strokeStyle = ln.color;
    ctx.lineWidth = ln.width;
    ctx.beginPath();
    ctx.moveTo(ln.pts[0][0], ln.pts[0][1]);
    for (let i = 1; i < ln.pts.length; i++) ctx.lineTo(ln.pts[i][0], ln.pts[i][1]);
    ctx.stroke();

    // label
    const [lx, ly] = ln.pts[ln.pts.length - 1];
    ctx.fillStyle = ln.color;
    ctx.font = "12px Segoe UI";
    ctx.fillText(ln.name, lx + 5, ly - 4);
  }
}
