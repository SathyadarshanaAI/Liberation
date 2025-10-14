const $ = (s, r=document) => r.querySelector(s);
const statusEl=$("#status"), video=$("#video"), overlay=$("#overlay");
const btnOpen=$("#open"), btnSnap=$("#snap"), btnClose=$("#close");
let stream;

const setStatus=t=>statusEl.textContent=t;
const secureOK=()=>location.protocol==="https:"||["localhost","127.0.0.1"].includes(location.hostname);

btnOpen.onclick = async () => {
  if (!secureOK()) { setStatus("Camera requires HTTPS or localhost."); alert("Use HTTPS or localhost."); return; }
  try{
    setStatus("Requesting camera…");
    stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment",width:{ideal:1280},height:{ideal:720}},audio:false});
    video.srcObject=stream; await video.play();
    btnSnap.disabled=false; setTimeout(()=>btnClose.disabled=false,300);
    setStatus("Camera ON. Hold your palm steady.");
  }catch(e){ console.warn(e); setStatus("Camera error: "+(e.message||e)); }
};

btnClose.onclick = () => {
  if(stream){ stream.getTracks().forEach(t=>t.stop()); stream=null; }
  video.srcObject=null; btnSnap.disabled=true; btnClose.disabled=true;
  setStatus("Camera OFF.");
};

btnSnap.onclick = () => {
  if(!video.videoWidth){ setStatus("Waiting for video…"); return; }
  overlay.width=video.videoWidth; overlay.height=video.videoHeight; overlay.style.display="block";
  const ctx=overlay.getContext("2d"); ctx.drawImage(video,0,0,overlay.width,overlay.height);

  // quick edge-ish overlay (placeholder for true analyzer)
  const img=ctx.getImageData(0,0,overlay.width,overlay.height), d=img.data, w=overlay.width, h=overlay.height;
  const luma=new Uint8ClampedArray(w*h);
  for(let i=0,p=0;i<d.length;i+=4,p++) luma[p]=(d[i]*.2126+d[i+1]*.7152+d[i+2]*.0722)|0;
  const edges=new Uint8ClampedArray(w*h);
  for(let y=1;y<h-1;y++){ for(let x=1;x<w-1;x++){ const i=y*w+x, gx=luma[i+1]-luma[i-1], gy=luma[i+w]-luma[i-w]; edges[i]=Math.min(255,Math.abs(gx)+Math.abs(gy)); } }
  ctx.lineWidth=1.4; ctx.strokeStyle="#00e5ff"; ctx.globalAlpha=.9; ctx.beginPath();
  const TH=220;
  for(let y=1;y<h-1;y+=2){ for(let x=1;x<w-1;x+=2){ const i=y*w+x; if(edges[i]>TH){ ctx.moveTo(x,y); ctx.lineTo(x+.5,y+.5); } } }
  ctx.stroke(); ctx.globalAlpha=1;
  setStatus("Snapshot captured (demo overlay).");
};

console.log("✅ App loaded");
