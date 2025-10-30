ච// 🕉️ Sathyadarshana Quantum Palm Analyzer · V15.2 Dharma Aura Visualization
// aura.js — Animated energy field representing Dharma illumination

export function drawAura(canvas, color = "#00e5ff") {
  const ctx = canvas.getContext("2d");
  const { width, height } = canvas;
  let radius = Math.min(width, height) / 3;
  let phase = 0;

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // background dim
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);
    ctx.globalAlpha = 1;

    // radiant aura gradient
    const grad = ctx.createRadialGradient(
      width / 2, height / 2, radius * 0.3,
      width / 2, height / 2, radius
    );
    grad.addColorStop(0, color);
    grad.addColorStop(1, "transparent");

    ctx.beginPath();
    ctx.arc(width / 2, height / 2, radius, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    // gentle pulse
    phase += 0.05;
    radius += Math.sin(phase) * 0.6;

    requestAnimationFrame(animate);
  }

  animate();
}
