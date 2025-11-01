// lines.js — V17.8 Stable Edition
export function drawPalm(ctx) {
  const w = ctx.canvas.width, h = ctx.canvas.height;
  ctx.lineWidth = 2;
  ctx.shadowBlur = 8;
  ctx.shadowColor = "#00e5ff";

  const lines = [
    { color: "#FFD700", points: [[w*0.25,h*0.85],[w*0.05,h*0.45],[w*0.45,h*0.75]] }, // Life line
    { color: "#00FFFF", points: [[w*0.20,h*0.55],[w*0.55,h*0.40],[w*0.85,h*0.45]] }, // Head line
    { color: "#FF69B4", points: [[w*0.25,h*0.40],[w*0.55,h*0.30],[w*0.85,h*0.25]] }, // Heart line
    { color: "#16F0A7", points: [[w*0.50,h*0.95],[w*0.55,h*0.60],[w*0.50,h*0.15]] }, // Fate line
    { color: "#FFA500", points: [[w*0.70,h*0.90],[w*0.75,h*0.55],[w*0.75,h*0.20]] }  // Sun line
  ];

  for (const line of lines) {
    ctx.beginPath();
    ctx.strokeStyle = line.color;
    const [start, ...rest] = line.points;
    ctx.moveTo(start[0], start[1]);
    for (const p of rest) ctx.lineTo(p[0], p[1]);
    ctx.stroke();
  }
}
