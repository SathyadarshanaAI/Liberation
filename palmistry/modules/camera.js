let stream, facing = 'environment';
const video = document.getElementById('video');

export async function start(){
  stream = await navigator.mediaDevices.getUserMedia({ video:{ facingMode:{ ideal:facing } } });
  video.srcObject = stream; video.hidden = false;
}
export async function switchCam(){ facing = (facing==='environment'?'user':'environment'); return start(); }
export async function torch(){
  const t = stream?.getVideoTracks?.()[0]; if (!t) throw new Error('No camera');
  const caps = t.getCapabilities?.()||{}; if (!caps.torch) throw new Error('Torch unsupported');
  const on = t.getSettings?.().torch;
  await t.applyConstraints({ advanced:[{ torch:!on }]});
}
export function capture(){
  const canvas = document.getElementById('canvas'), ctx = canvas.getContext('2d');
  const r = document.getElementById('camBox').getBoundingClientRect();
  const d = Math.min(devicePixelRatio||1, 2); canvas.width=r.width*d; canvas.height=r.height*d;
  drawToCanvas(video, canvas, ctx); return canvas;
}
function drawToCanvas(src, canvas, ctx){
  const w=canvas.width,h=canvas.height, sw=src.videoWidth||src.width, sh=src.videoHeight||src.height;
  const CR=w/h, R=sw/sh; let sx=0,sy=0,Ssw=sw,Ssh=sh;
  if(R>CR){ Ssh=sh; Ssw=Ssh*CR; sx=(sw-Ssw)/2; } else { Ssw=sw; Ssh=Ssw/CR; sy=(sh-Ssh)/2; }
  ctx.fillStyle='#000'; ctx.fillRect(0,0,w,h); ctx.drawImage(src,sx,sy,Ssw,Ssh,0,0,w,h);
}
