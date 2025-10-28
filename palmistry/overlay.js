export function drawAIOverlay(canvas,side){
  const ctx=canvas.getContext("2d");
  const colors=["#FFD700","#FF4500","#00FFFF","#ADFF2F","#FF69B4","#00FF7F","#FFA500","#FF00FF"];
  ctx.lineWidth=2; ctx.globalAlpha=0.7;
  for(let i=0;i<8;i++){
    ctx.strokeStyle=colors[i];
    ctx.beginPath();
    ctx.moveTo(Math.random()*canvas.width,Math.random()*canvas.height/2);
    ctx.lineTo(Math.random()*canvas.width,canvas.height*Math.random());
    ctx.stroke();
  }
}
