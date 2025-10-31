// ✋ Dharma Palm Line Drawer (drawLines)
export function drawLines(ctx){
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;

  const glow = "#FFD700";
  const neon = "#00FFFF";

  const lines = [
    { name: "Life",   path: [[w*0.25,h*0.85],[w*0.05,h*0.45],[w*0.45,h*0.75]] },
    { name: "Head",   path: [[w*0.20,h*0.55],[w*0.55,h*0.40],[w*0.85,h*0.45]] },
    { name: "Heart",  path: [[w*0.25,h*0.40],[w*0.55,h*0.30],[w*0.85,h*0.25]] },
    { name: "Fate",   path: [[w*0.50,h*0.95],[w*0.55,h*0.60],[w*0.50,h*0.15]] },
    { name: "Sun",    path: [[w*0.70,h*0.90],[w*0.75,h*0.55],[w*0.80,h*0.20]] },
    { name: "Health", path: [[w*0.10,h*0.90],[w*0.40,h*0.60],[w*0.60,h*0.30]] }
  ];

  ctx.lineWidth = 2;
  ctx.shadowBlur = 10;
  ctx.shadowColor = glow;
  ctx.strokeStyle = neon;

  lines.forEach(line=>{
    ctx.beginPath();
    ctx.moveTo(line.path[0][0], line.path[0][1]);
    for(let i=1;i<line.path.length;i++){
      ctx.lineTo(line.path[i][0], line.path[i][1]);
    }
    ctx.stroke();
  });
}
