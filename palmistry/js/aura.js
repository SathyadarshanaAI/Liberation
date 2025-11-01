// 🌌 aura.js — Animated Dharma Aura Glow
export function drawAura(canvas, color = "#00e5ff") {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let radius = 40;
  let growing = true;

  function animate() {
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const grad = ctx.createRadialGradient(w/2, h/2, radius/4, w/2, h/2, radius);
    grad.addColorStop(0, color);
    grad.addColorStop(1, "transparent");

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    if (growing) radius += 1.2; else radius -= 1.2;
    if (radius > 150) growing = false;
    if (radius < 40) growing = true;

    requestAnimationFrame(animate);
  }
  animate();
}
