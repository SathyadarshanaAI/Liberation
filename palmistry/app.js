// app.js — Quantum Palm Analyzer v4.6
const $ = (s, r=document) => r.querySelector(s);
const statusEl=$("#status"), video=$("#video"), overlay=$("#overlay"), resultEl=$("#result");
const btnOpen=$("#open"), btnSnap=$("#snap"), btnClose=$("#close");

let stream, scanning=false;

const setStatus=t=>statusEl.textContent=t;
const secureOK=()=>location.protocol==="https:"||["localhost","127.0.0.1"].includes(location.hostname);

// ── Camera controls ────────────────────────────────────────────────────────────
btnOpen.onclick = async () => {
  if (!secureOK()) { setStatus("Camera requires HTTPS or localhost."); alert("Use HTTPS or localhost."); return; }
  try{
    setStatus("Requesting camera…");
    stream=await navigator.mediaDevices.getUserMedia({
      video:{facingMode:"environment",width:{ideal:1280},height:{ideal:720}}, audio:false
    });
    video.srcObject=stream; await video.play();
    btnSnap.disabled=false; setTimeout(()=>btnClose.disabled=false,300);
    setStatus("Camera ON. Hold your palm steady. Fill the frame.");
  }catch(e){ console.warn(e); setStatus("Camera error: "+(e.message||e)); }
};

btnClose.onclick = () => {
  if(stream){ stream.getTracks().forEach(t=>t.stop()); stream=null; }
  video.srcObject=null; btnSnap.disabled=true; btnClose.disabled=true;
  overlay.style.display="none"; resultEl.innerHTML=""; setStatus("Camera OFF.");
};

// ── Low-light enhance ─────────────────────────────────────────────────────────
function enhance(ctx,w,h,brightness=40,contrast=1.35){
  const img=ctx.getImageData(0,0,w,h), d=img.data;
  for(let i=0;i<d.length;i+=4){
    d[i]   = Math.min(255, (d[i]-128)*contrast + 128 + brightness);
    d[i+1] = Math.min(255, (d[i+1]-128)*contrast + 128 + brightness);
    d[i+2] = Math.min(255, (d[i+2]-128)*contrast + 128 + brightness);
  }
  ctx.putImageData(img,0,0);
}

// ── Edge map ──────────────────────────────────────────────────────────────────
function edgeMap(ctx,w,h){
  const img=ctx.getImageData(0,0,w,h), d=img.data;
  const luma=new Uint8ClampedArray(w*h);
  for(let i=0,p=0;i<d.length;i+=4,p++) luma[p]=(d[i]*.2126+d[i+1]*.7152+d[i+2]*.0722)|0;

  const edges=new Uint8ClampedArray(w*h);
  for(let y=1;y<h-1;y++){
    for(let x=1;x<w-1;x++){
      const i=y*w+x, gx=luma[i+1]-luma[i-1], gy=luma[i+w]-luma[i-w];
      edges[i]=Math.min(255, Math.abs(gx)+Math.abs(gy));
    }
  }
  return {edges,luma};
}

// ── Skin mask (YCbCr-ish) for thumb-side heuristic ────────────────────────────
function skinMask(ctx,w,h){
  const img=ctx.getImageData(0,0,w,h), d=img.data;
  const mask=new Uint8Array(w*h);
  for(let y=0;y<h;y++){
    for(let x=0;x<w;x++){
      const i=(y*w+x)*4, R=d[i], G=d[i+1], B=d[i+2];
      const Cb=(-0.168736*R-0.331264*G+0.5*B)+128;
      const Cr=( 0.5*R-0.418688*G-0.081312*B)+128;
      mask[y*w+x] = (Cr>135&&Cr<180&&Cb>85&&Cb<135) ? 1 : 0;
    }
  }
  return mask;
}

function detectHandSide(ctx,w,h){
  const mask=skinMask(ctx,w,h);
  const band=Math.round(w*0
