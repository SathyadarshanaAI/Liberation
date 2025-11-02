// lines.js — Digital Serenity Wisdom Edition · V17.9
// 🪷 Draws energy lines over palm with Dharma-style neon flow

export function drawPalm(ctx) {
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;

  // ✨ Neon palette of serenity
  const neon = {
    life: "#FFD700",      // golden light of vitality
    head: "#00FFFF",      // clarity & wisdom
    heart: "#FF69B4",     // compassion
    fate: "#00FF7F",      // destiny & growth
    sun: "#FFA500",       // creativity & radiance
    health: "#00CED1",    // healing balance
    marriage: "#FF1493",  // devotion
    manikanda: "#FF4500"  // hidden treasure / karmic line
  };

  // 💫 line helper
  const glowLine = (pts, color, name) => {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.shadowBlur = 8;
    ctx.shadowColor = color;
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.stroke();

    // 🌸 label
    ctx.font = "13px Segoe UI";
    ctx.shadowBlur = 0;
    ctx.fillStyle = color;
    const [lx, ly] = pts[Math.floor(pts.length / 2)];
    ctx.fillText(name, lx + 5, ly - 5);
  };

  // 🔮 Serenity line map (approximate placement)
  const lines = [
    { name: "Life", pts: [[w * 0.20, h * 0.85], [w * 0.10, h * 0.45], [w * 0.45, h * 0.70]], col: neon.life },
    { name: "Head", pts: [[w * 0.25, h * 0.55], [w * 0.55, h * 0.40], [w * 0.85, h * 0.42]], col: neon.head },
    { name: "Heart", pts: [[w * 0.25, h * 0.35], [w * 0.55, h * 0.25], [w * 0.85, h * 0.20]], col: neon.heart },
    { name: "Fate", pts: [[w * 0.50, h * 0.95], [w * 0.55, h * 0.60], [w * 0.50, h * 0.15]], col: neon.fate },
    { name: "Sun", pts: [[w * 0.68, h * 0.92], [w * 0.75, h * 0.60], [w * 0.78, h * 0.20]], col: neon.sun },
    { name: "Health", pts: [[w * 0.35, h * 0.90], [w * 0.45, h * 0.65], [w * 0.55, h * 0.45]], col: neon.health },
    { name: "Marriage", pts: [[w * 0.80, h * 0.28], [w * 0.90, h * 0.25]], col: neon.marriage },
    { name: "Manikanda", pts: [[w * 0.15, h * 0.95], [w * 0.50, h * 0.60]], col: neon.manikanda }
  ];

  // 🪷 Draw all lines with a floating aura pulse
  lines.forEach(l => glowLine(l.pts, l.col, l.name));

  // 🌕 Serenity aura (gentle radial glow)
  const g = ctx.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, w / 1.5);
  g.addColorStop(0, "rgba(22,240,167,0.15)");
  g.addColorStop(1, "rgba(11,15,22,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}
