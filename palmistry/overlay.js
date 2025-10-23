// === Quantum Palm Analyzer V7.1 — Visual Overlay Extension ===
// draws simple colored lines + mount circles over the hand image

function drawOverlay(canvas, data){
  const ctx = canvas.getContext("2d");
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.8;

  // === Major Lines ===
  const w = canvas.width, h = canvas.height;
  const L = data.lines || {};

  const lines = {
    life:["#ff4444",[w*0.3,h*0.75,w*0.4,h*0.6,w*0.45,h*0.45]],
    head:["#00ff88",[w*0.2,h*0.55,w*0.5,h*0.55,w*0.75,h*0.5]],
    heart:["#33aaff",[w*0.2,h*0.4,w*0.5,h*0.35,w*0.8,h*0.3]],
    fate:["#bb66ff",[w*0.5,h*0.8,w*0.5,h*0.4]],
    sun:["#ff9933",[w*0.65,h*0.7,w*0.7,h*0.4]],
    mercury:["#ffff33",[w*0.8,h*0.7,w*0.85,h*0.3]],
    marriage:["#ffffff",[w*0.7,h*0.2,w*0.85,h*0.2]],
    manikanda:["#aa7744",[w*0.3,h*0.9,w*0.7,h*0.9]]
  };

  for(const [name,[color,pts]] of Object.entries(lines)){
    ctx.strokeStyle=color;
    ctx.beginPath();
    if(Array.isArray(pts[0])){ // multi segment
      ctx.moveTo(pts[0][0],pts[0][1]);
      pts.slice(1).forEach(p=>ctx.lineTo(p[0],p[1]));
    }else{
      ctx.moveTo(pts[0],pts[1]);
      for(let i=2;i<pts.length;i+=2) ctx.lineTo(pts[i],pts[i+1]);
    }
    ctx.stroke();
  }

  // === Mounts ===
  const mounts = {
    venus:[w*0.2,h*0.8,"#ff77aa"],
    jupiter:[w*0.4,h*0.25,"#ffd700"],
    saturn:[w*0.5,h*0.25,"#00ffff"],
    apollo:[w*0.6,h*0.3,"#00ff00"],
    mercury:[w*0.75,h*0.3,"#cc66ff"],
    mars:[w*0.5,h*0.5,"#ff6600"],
    moon:[w*0.8,h*0.75,"#ddddff"]
  };

  for(const [name,[x,y,color]] of Object.entries(mounts)){
    ctx.fillStyle=color;
    ctx.beginPath();
    ctx.arc(x,y,10,0,Math.PI*2);
    ctx.fill();
  }
  msg("🌈 Overlay drawn – 8 lines & 7 mounts visible");
}
