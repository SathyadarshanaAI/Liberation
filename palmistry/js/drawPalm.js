// 🕉️ Sathyadarshana Quantum Palm Analyzer · V15.3 Dharma Fusion Edition
// drawPalm.js — Draws palm outline + 8 major lines with glow

export function drawPalm(ctx) {
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;

  // Clear canvas
  ctx.clearRect(0, 0, w, h);

  // === Palm outline ===
  ctx.strokeStyle = "#444";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(w * 0.35, h * 0.05);
  ctx.quadraticCurveTo(w * 0.15, h * 0.4, w * 0.25, h * 0.9);
  ctx.quadraticCurveTo(w * 0.5, h * 0.95, w * 0.75, h * 0.9);
  ctx.quadraticCurveTo(w * 0.85, h * 0.4, w * 0.65, h * 0.05);
  ctx.closePath();
  ctx.stroke();

  // === Define palm lines ===
  const lines = [
    { name: "Life", color: "#ff6b6b", points: [[0.25, 0.85], [0.05, 0.45], [0.45, 0.75]] },
    { name: "Head", color: "#00cfff", points: [[0.2, 0.55], [0.55, 0.40], [0.85, 0.45]] },
    { name: "Heart", color: "#ffdf00", points: [[0.25, 0.40], [0.55, 0.30], [0.85, 0.25]] },
    { name: "Fate", color: "#a855f7", points: [[0.5, 0.95], [0.55, 0.60], [0.50, 0.15]] },
    { name: "Sun", color: "#ff9900", points: [[0.70, 0.90], [0.75, 0.55], [0.80, 0.20]] },
    { name: "Health", color: "#16f0a7", points: [[0.75, 0.85], [0.55, 0.65], [0.35, 0.45]] },
    { name: "Marriage", color: "#00ffff", points: [[0.70, 0.25], [0.85, 0.15]] },
    { name: "Manikanda", color: "#ff66cc", points: [[0.45, 0.85], [0.60, 0.55], [0.70, 0.35]] },
  ];

  // === Draw each line ===
  for (const line of lines) {
    ctx.beginPath();
    const [first, ...rest] = line.points;
    ctx.moveTo(w * first[0], h * first[1]);
    for (const p of rest) ctx.lineTo(w * p[0], h * p[1]);
    ctx.strokeStyle = line.color;
    ctx.lineWidth = 3;
    ctx.shadowColor = line.color;
    ctx.shadowBlur = 8;
    ctx.stroke();
  }

  // Label “Palm AI Scan Active”
  ctx.shadowBlur = 0;
  ctx.font = "bold 14px Segoe UI";
  ctx.fillStyle = "#00e5ff";
  ctx.textAlign = "center";
  ctx.fillText("🔮 Dharma Palm Analyzer Active", w / 2, h - 10);
}
