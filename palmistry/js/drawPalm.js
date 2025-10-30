export function drawPalm(ctx){
 const w=ctx.canvas.width,h=ctx.canvas.height;
 const glow="#FFD700",neon="#00FFFF";
 const lines=[
  {n:"Life",p:[[w*0.25,h*0.85],[w*0.05,h*0.45],[w*0.45,h*0.75]]},
  {n:"Head",p:[[w*0.20,h*0.55],[w*0.55,h*0.40],[w*0.85,h*0.45]]},
  {n:"Heart",p:[[w*0.25,h*0.40],[w*0.55,h*0.30],[w*0.85,h*0.25]]},
  {n:"Fate",p:[[w*0.50,h*0.95],[w*0.55,h*0.60],[w*0.50,h*0.15]]},
  {n:"Sun",p:[[w*0.70,h*0.90],[w*0.75,h*0.55],[w*0.80,h*0.20]]},
  {n:"Health",p:[[w*0.40,h*0.95],[w*0.55,h*0.70],[w*0.80,h*0.45]]},
  {n:"Marriage",p:[[w*0.78,h*0.25],[w*0.85,h*0.27],[w*0.90,h*0.30]]},
  {n:"Manikanda",p:[[w*0.35,h*0.20],[w*0.50,h*0.35],[w*0.65,h*0.55]]}
 ];
 lines.forEach(L=>{
  ctx.beginPath();
  const grad=ctx.createLinearGradient(L.p[0][0],L.p[0][1],L.p[2][0],L.p[2][1]);
  grad.addColorStop(0,glow);grad.addColorStop(1,neon);
  ctx.strokeStyle=grad;ctx.lineWidth=2.2;ctx.shadowColor=glow;ctx.shadowBlur=6;
  ctx.moveTo(...L.p[0]);ctx.bezierCurveTo(...L.p[0],...L.p[1],...L.p[2]);ctx.stroke();
  ctx.shadowBlur=0;ctx.fillStyle="#00e5ff";ctx.font="10px Segoe UI";
  ctx.fillText(L.n,L.p[2][0]-25,L.p[2][1]-3);
 });
}
