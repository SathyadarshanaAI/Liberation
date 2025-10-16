cat > app.js <<'JS'
// Quantum Palm Analyzer v5.0
const $=(s,r=document)=>r.querySelector(s);
const statusEl=$("#status"),video=$("#video"),overlay=$("#overlay");
const btnOpen=$("#open"),btnSnap=$("#snap"),btnClose=$("#close");
const btnSave=$("#save"),btnReset=$("#reset");
const resultEl=$("#result");
let stream, lastShot=null;

const secureOK=()=>location.hostname==="localhost"||location.hostname==="127.0.0.1"||location.protocol==="https:";

/* ---------------- Camera ---------------- */
btnOpen.onclick=async()=>{
  if(!secureOK()){ alert("Use HTTPS or localhost"); return; }
  try{
    stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"},audio:false});
    video.srcObject=stream; await video.play();
    enable(btnSnap,btnClose); disable(btnSave,btnReset);
    status("Camera ON");
  }catch(e){ status("Camera error: "+e.message); }
};

btnClose.onclick=stopCamera;
function stopCamera(){
  if(stream){ stream.getTracks().forEach(t=>t.stop()); stream=null; }
  video.srcObject=null; disable(btnSnap,btnClose,btnSave,btnReset);
  status("Camera OFF");
}

/* ---------------- Helpers ---------------- */
const enable=(...els)=>els.forEach(el=>el.disabled=false);
const disable=(...els)=>els.forEach(el=>el.disabled=true);
const status=t=>statusEl.textContent=t;

function avgBrightness(img){
  const d=img.data; let s=0;
  for(let i=0;i<d.length;i+=4){ s+= (d[i]+d[i+1]+d[i+2])/3; }
  return s/(d.length/4);
}
function skinMask(ctx,w,h){
  const img=ctx.getImageData(0,0,w,h), d=img.data;
  const m=new Uint8ClampedArray(w*h);
  for(let i=0,j=0;i<d.length;i+=4,++j){
    const r=d[i],g=d[i+1],b=d[i+2];
    const skin=(r>95&&g>40&&b>20&&(Math.max(r,g,b)-Math.min(r,g,b))>15&&Math.abs(r-g)>15&&r>g&&r>b);
    m[j]=skin?255:0;
  }
  return m;
}
function estimateSide(mask,w,h){
  let L=w,R=0,T=h,B=0;
  for(let y=0;y<h;y++){
    for(let x=0;x<w;x++){
      if(mask[y*w+x]){ if(x<L)L=x; if(x>R)R=x; if(y<T)T=y; if(y>B)B=y; }
    }
  }
  if(R<=L) return {side:"unknown",bbox:null};
  const bbox={L,R,T,B,w:R-L,h:B-T};
  const side=(L>(w-R))?"RIGHT hand":"LEFT hand"; // margin heuristic
  return {side,bbox};
}
function drawScanBeam(ctx,w,h,progress){
  ctx.save();
  ctx.fillStyle="rgba(0,0,0,0.35)"; ctx.fillRect(0,0,w,h);
  const y=progress*h;
  const g=ctx.createLinearGradient(0,y-40,0,y+40);
  g.addColorStop(0,"rgba(0,229,255,0)");
  g.addColorStop(.5,"rgba(0,229,255,0.85)");
  g.addColorStop(1,"rgba(0,229,255,0)");
  ctx.fillStyle=g; ctx.fillRect(0,y-40,w,80);
  ctx.restore();
}

/* ---------------- Snap + Analyze ---------------- */
btnSnap.onclick=async()=>{
  overlay.width=video.videoWidth||640;
  overlay.height=video.videoHeight||480;
  overlay.style.display="block";
  const ctx=overlay.getContext("2d");

  // scanning anim (600ms)
  const start=performance.now(), dur=600;
  status("Analyzing…");
  await new Promise(res=>{
    const loop=now=>{
      const t=Math.min(1,(now-start)/dur);
      ctx.drawImage(video,0,0,overlay.width,overlay.height);
      drawScanBeam(ctx,overlay.width,overlay.height,t);
      if(t<1) requestAnimationFrame(loop); else res();
    }; requestAnimationFrame(loop);
  });

  // analysis
  ctx.drawImage(video,0,0,overlay.width,overlay.height);
  const frame=ctx.getImageData(0,0,overlay.width,overlay.height);
  const light=Math.round(avgBrightness(frame));
  const quality= light<40?"Very Dark":light<70?"Dim":light<120?"OK":"Bright";

  const mask=skinMask(ctx,overlay.width,overlay.height);
  const {side,bbox}=estimateSide(mask,overlay.width,overlay.height);

  // line accent
  const img=ctx.getImageData(0,0,overlay.width,overlay.height), d=img.data;
  for(let i=0;i<d.length;i+=4){
    const avg=(d[i]+d[i+1]+d[i+2])/3;
    if(avg<60){ d[i]=0; d[i+1]=255; d[i+2]=255; }
    else if(avg<120){ d[i]=22; d[i+1]=240; d[i+2]=167; }
  }
  ctx.putImageData(img,0,0);

  if(bbox){
    ctx.strokeStyle="#00e5ff"; ctx.lineWidth=3;
    ctx.strokeRect(bbox.L,bbox.T,bbox.w,bbox.h);
  }

  lastShot=overlay.toDataURL("image/png");
  resultEl.innerHTML=`
    <div class="card">
      <div style="font-weight:700;color:#00e5ff;margin-bottom:6px">Scan Result</div>
      <div>Hand: <b>${side}</b></div>
      <div>Lighting: <b>${quality}</b> (avg=${light})</div>
      <div>Resolution: ${overlay.width}×${overlay.height}</div>
      <div style="opacity:.8;margin-top:6px">Tip: keep palm centered & fill the frame.</div>
    </div>`;
  enable(btnSave,btnReset);
  status("Done");
};

btnSave.onclick=()=>{
  if(!lastShot) return;
  const a=document.createElement("a");
  a.href=lastShot; a.download=`palm_${Date.now()}.png`;
  document.body.appendChild(a); a.click(); a.remove();
};
btnReset.onclick=()=>{
  overlay.getContext("2d").clearRect(0,0,overlay.width,overlay.height);
  overlay.style.display="none";
  resultEl.innerHTML=""; lastShot=null; status("Ready");
};

console.log("Quantum Palm Analyzer v5.0 loaded");
JS
