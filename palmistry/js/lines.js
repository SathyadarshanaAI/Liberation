// lines.js — V18.0 Realistic 7-Line Mapping Edition
export function drawPalm(ctx) {
  const w = ctx.canvas.width, h = ctx.canvas.height;
  ctx.lineWidth = 2;
  ctx.shadowBlur = 8;

  const lines = [
    // Life Line (බොහෝ විට අඟුලට අසලින් අතේ මූලය වටා හැරෙයි)
    { name: "Life", color: "#FFD700", path: [[w*0.35,h*0.85],[w*0.25,h*0.65],[w*0.20,h*0.45],[w*0.30,h*0.25]] },
    // Head Line (අතේ මැදින් තිරස්)
    { name: "Head", color: "#00FFFF", path: [[w*0.20,h*0.55],[w*0.50,h*0.45],[w*0.85,h*0.48]] },
    // Heart Line (ඉහළින්, අඟුල් වලට යටින්)
    { name: "Heart", color: "#FF69B4", path: [[w*0.25,h*0.35],[w*0.55,h*0.30],[w*0.85,h*0.28]] },
    // Fate Line (අතේ මැදින් සෘජුව යන vertical)
    { name: "Fate", color: "#16F0A7", path: [[w*0.50,h*0.95],[w*0.50,h*0.60],[w*0.48,h*0.25]] },
    // Sun Line (සෘජුව දකුණ පස)
    { name: "Sun", color: "#FFA500", path: [[w*0.70,h*0.90],[w*0.72,h*0.55],[w*0.72,h*0.25]] },
    // Health Line (ඇලොක්කාර රේඛාවක්)
    { name: "Health", color: "#00FF66", path: [[w*0.65,h*0.85],[w*0.55,h*0.55],[w*0.35,h*0.35]] },
    // Marriage Line (ඉහළ කොනේ කෙටි රේඛාවක්)
    { name: "Marriage", color: "#FFB6C1", path: [[w*0.75,h*0.22],[w*0.85,h*0.20]] }
  ];

  for (const ln of lines) {
    ctx.beginPath();
    ctx.strokeStyle = ln.color;
    const [start, ...rest] = ln.path;
    ctx.moveTo(start[0], start[1]);
    rest.forEach(p => ctx.lineTo(p[0], p[1]));
    ctx.stroke();
  }

  // Add glowing label markers
  ctx.font = "12px Segoe UI";
  ctx.fillStyle = "#00e5ff";
  ctx.fillText("Life", w*0.25, h*0.75);
  ctx.fillText("Head", w*0.55, h*0.47);
  ctx.fillText("Heart", w*0.60, h*0.30);
  ctx.fillText("Fate", w*0.48, h*0.55);
  ctx.fillText("Sun", w*0.70, h*0.50);
  ctx.fillText("Health", w*0.45, h*0.45);
  ctx.fillText("Marriage", w*0.80, h*0.22);
}
