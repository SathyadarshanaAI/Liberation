// 🕉️ Sathyadarshana Quantum Palm Analyzer · V15.2 Dharma Aura Visualization

export function drawAura(canvas, color = "#00e5ff") {
  const ctx = canvas.getContext("2d");
  const { width, height } = canvas;
  let radius = Math.min(width, height) / 3;
  let glow = 0;
  const animate = () => {
    ctx.clearRect(0, 0, width, height);
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);
    ctx.globalAlpha = 1;

    const grad = ctx.createRadialGradient(
      width / 2, height / 2, radius * 0.4,
      width / 2, height / 2, radius
    );
    grad.addColorStop(0, color);
    grad.addColorStop(1, "transparent");
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, radius, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    glow += 0.05;
    radius += Math.sin(glow) * 0.4;
    requestAnimationFrame(animate);
  };
  animate();
}
