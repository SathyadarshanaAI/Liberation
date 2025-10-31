// 🕉️ Sathyadarshana Quantum Palm Analyzer · V15.5 Dharma Pulse Geometry Edition
// drawPalm.js — animated glowing 8-line geometry + Dharma pulse

export function drawPalm(ctx) {
  const w = ctx.canvas.width, h = ctx.canvas.height;
  const fx = w / 500, fy = h / 800;

  // --- configuration ---
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

  let pulse = 0;

  function animate() {
    ctx.clearRect(0, 0, w, h);

    // === Dharma Pulse background ===
    const grad = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, w/2.5);
    grad.addColorStop(0, `rgba(0,255,255,${0.15 + Math.sin(pulse)*0.1})`);
    grad.addColorStop(1, "transparent");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // --- base hand oval outline ---
    ctx.save();
    ctx.translate(0, h * -0.05);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.beginPath();
    ctx.ellipse(w/2, h*0.55, w*0.35, h*0.45, 0, 0, Math.PI*2);
    ctx.stroke();
    ctx.restore();

    // --- animate glow intensity ---
    const glowIntensity = 8 + Math.sin(pulse * 2) * 4;

    // --- draw lines ---
    for (const ln of lines) {
      ctx.beginPath();
      ctx.shadowColor = ln.c;
      ctx.shadowBlur = glowIntensity;
      ctx.strokeStyle = ln.c;
      ctx.lineWidth = 2.6;

      const [start, ...rest] = ln.p;
      ctx.moveTo(...start);
      for (const pt of rest) ctx.lineTo(...pt);
      ctx.stroke();
    }

    // --- animated labels ---
    ctx.font = `${12*fx}px Segoe UI`;
    ctx.fillStyle = `rgba(22,240,167,${0.8 + Math.sin(pulse*1.5)*0.2})`;
    for (const ln of lines) {
      const [x, y] = ln.p[Math.floor(ln.p.length / 2)];
      ctx.fillText(ln.n, x + 5, y - 4);
    }

    // --- subtle Dharma pulse aura ring ---
    ctx.beginPath();
    ctx.arc(w/2, h/2, 30 + Math.sin(pulse*2)*5, 0, Math.PI*2);
    ctx.strokeStyle = `rgba(255,215,0,${0.5 + Math.sin(pulse)*0.4})`;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    pulse += 0.03;
    requestAnimationFrame(animate);
  }

  animate();
}
