// lines.js — V18.6.1 Line Bind Fix Edition
export function drawPalm(ctx) {
  if (!ctx) return;

  const w = ctx.canvas.width;
  const h = ctx.canvas.height;

  const lines = [
    { name: "Life", color: "#FFD700", p: [[w*0.25,h*0.85],[w*0.1,h*0.45],[w*0.45,h*0.75]] },
    { name: "Head", color: "#00FFFF", p: [[w*0.2,h*0.55],[w*0.55,h*0.4],[w*0.85,h*0.45]] },
    { name: "Heart", color: "#FF69B4", p: [[w*0.25,h*0.4],[w*0.55,h*0.3],[w*0.85,h*0.25]] },
    { name: "Fate", color: "#00FF7F", p: [[w*0.5,h*0.95],[w*0.55,h*0.6],[w*0.5,h*0.15]] },
    { name: "Sun", color: "#FFA500", p: [[w*0.7,h*0.9],[w*0.75,h*0.6],[w*0.8,h*0.25]] },
    { name: "Health", color: "#FF4500", p: [[w*0.15,h*0.9],[w*0.4,h*0.55]] },
    { name: "Manikanda", color: "#00FFEA", p: [[w*0.45,h*0.9],[w*0.5,h*0.6],[w*0.55,h*0.3]] }
  ];

  ctx.save();
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.9;

  // 🪶 Glow Effect
  lines.forEach(line => {
    ctx.strokeStyle = line.color;
    ctx.shadowColor = line.color;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.moveTo(line.p[0][0], line.p[0][1]);
    for (let i=1; i<line.p.length; i++) {
      ctx.lineTo(line.p[i][0], line.p[i][1]);
    }
    ctx.stroke();

    // Label
    ctx.shadowBlur = 0;
    ctx.font = "bold 12px Segoe UI";
    ctx.fillStyle = line.color;
    const last = line.p[line.p.length-1];
    ctx.fillText(line.name, last[0]+4, last[1]-4);
  });

  ctx.restore();
  console.log("✨ Palm lines drawn successfully");
}
