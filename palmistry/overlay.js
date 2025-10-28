export function drawAIOverlay(canvas, side){
  const ctx = canvas.getContext("2d");
  const grad = ctx.createLinearGradient(0,0,canvas.width,canvas.height);
  grad.addColorStop(0,"rgba(255,215,0,0.6)");
  grad.addColorStop(1,"rgba(255,255,255,0.2)");
  ctx.strokeStyle = grad;
  ctx.lineWidth = 2;
  ctx.shadowBlur = 12;
  ctx.shadowColor = "gold";
  ctx.beginPath();
  ctx.moveTo(30,canvas.height-40);
  ctx.bezierCurveTo(canvas.width/3,canvas.height/2,canvas.width/1.5,50,canvas.width-30,canvas.height/2);
  ctx.stroke();
  console.log(`🌟 Overlay drawn for ${side} hand`);
}
