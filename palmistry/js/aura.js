// 🌌 Dharma Aura Animation Layer
export function drawAura(ctx){
  const w = ctx.canvas.width, h = ctx.canvas.height;
  let t = 0;

  function loop(){
    t += 0.03;
    ctx.clearRect(0,0,w,h);

    const grd = ctx.createRadialGradient(w/2, h/2, 50, w/2, h/2, 180);
    grd.addColorStop(0, `rgba(0,255,255,${0.25+0.15*Math.sin(t)})`);
    grd.addColorStop(0.5, `rgba(255,215,0,${0.15+0.15*Math.cos(t/2)})`);
    grd.addColorStop(1, "rgba(0,0,0,0)");

    ctx.fillStyle = grd;
    ctx.fillRect(0,0,w,h);
    requestAnimationFrame(loop);
  }

  loop();
}
