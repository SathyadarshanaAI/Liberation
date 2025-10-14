// app.js — Quantum Palm Analyzer v4.7+
const $=(s,r=document)=>r.querySelector(s);
const statusEl=$("#status"), video=$("#video"), overlay=$("#overlay");
const btnOpen=$("#open"), btnSnap=$("#snap"), btnClose=$("#close");
const resultEl=$("#result");
let stream;

const secureOK = () =>
  location.hostname==="localhost" ||
  location.hostname==="127.0.0.1" ||
  location.protocol==="https:";

/* ---------------- Camera controls ---------------- */
btnOpen.onclick = async () => {
  if(!secureOK()){ alert("Use HTTPS or localhost"); return; }
  try{
    stream = await navigator.mediaDevices.getUserMedia({
      video:{ facingMode:"environment" }, audio:false
    });
    video.srcObject = stream;
    await video.play();
    btnSnap.disabled = false; btnClose.disabled = false;
    statusEl.textContent = "Camera ON";
  }catch(e){
    statusEl.textContent = "Camera error: " + e.message;
  }
};

btnClose.onclick = () => {
  if(stream){ stream.getTracks().forEach(t=>t.stop()); stream = null; }
  video.srcObject = null;
  btnSnap.disabled = true; btnClose.disabled = true;
  statusEl.textContent = "Camera OFF";
};

/* ---------------- Utils ---------------- */
function brightness(r,g,b){ return (r+g+g+b)/4 } // green bias
function avgBrightness(pixels){
  let d=pixels.data,sum=0;
  for(let i=0;i<d.length;i+=4) sum+=brightness(d[i],d[i+1],d[i+2]);
  return sum/(d.length/4);
}

// crude skin mask (fast): YCbCr-ish threshold on RGB
function skinMask(ctx,w,h){
  const img=ctx.getImageData(0,0,w,h), d=img.data;
  const mask=new Uint8ClampedArray(w*h);
  for(let i=0,j=0;i<d.length;i+=4,++j){
    const r=d[i], g=d[i+1], b=d[i+2];
    const max=Math.max(r,g,b), min=Math.min(r,g,b);
    const sat = max-min;
    const skin = (r>95 && g>40 && b>20 && (max-min)>15 && Math.abs(r-g)>15 && r>g && r>b);
    mask[j] = skin ? 255 : 0;
  }
  return mask;
}

// estimate left/right: compare leftmost vs rightmost extent of skin mask
function estimateHandSide(mask,w,h){
  let left=w, right=0, top=h, bottom=0;
  for(let y=0;y<h;y++){
    for(let x=0;x<w;x++){
      const v = mask[y*w+x];
      if(v){
        if(x<left) left=x;
        if(x>right) right=x;
        if(y<top) top=y;
        if(y>bottom) bottom=y;
      }
    }
  }
  if(right<=left) return {side:"unknown", bbox:null};
  const bbox={left, right, top, bottom, cx:(left+right)/2, cy:(top+bottom)/2};
  // thumb side ≈ side with larger empty margin outside bbox
  const leftMargin  = bbox.left;
  const rightMargin = w - bbox.right;
  const side = leftMargin > rightMargin ? "RIGHT hand" : "LEFT hand"; // if big space on left -> thumb on left -> right hand shown
  return {side, bbox};
}

/* ---------------- Scanner animation + analyze ---------------- */
btnSnap.onclick = async () => {
  // draw frame
  overlay.width = video.videoWidth || 640;
  overlay.height = video.videoHeight || 480;
  overlay.style.display="block";
  const ctx = overlay.getContext("2d");
  ctx.drawImage(video, 0, 0, overlay.width, overlay.height);

  // scanner beam anim (top -> bottom)
  statusEl.textContent = "Analyzing…";
  await scanBeam(ctx, overlay.width, overlay.height, 600);

  // make a copy after beam for processing
  const frame = ctx.getImageData(0,0,overlay.width,overlay.height);

  // lighting quality
  const light = Math.round(avgBrightness(frame));
  const quality = light<40 ? "Very Dark" : light<70 ? "Dim" : light<120 ? "OK" : "Bright";

  // skin mask + side
  const mask = skinMask(ctx, overlay.width, overlay.height);
  const {side, bbox} = estimateHandSide(mask, overlay.width, overlay.height);

  // overlay: outline bbox & pseudo line highlight
  ctx.putImageData(frame,0,0);
  if(bbox){
    ctx.strokeStyle = "#00e5ff"; ctx.lineWidth = 3;
    ctx.strokeRect(bbox.left, bbox.top, bbox.right-bbox.left, bbox.bottom-bbox.top);
  }
  // quick line accent: emphasize darker creases
  const img=ctx.getImageData(0,0,overlay.width,overlay.height), d=img.data;
  for(let i=0;i<d.length;i+=4){
    const avg=(d[i]+d[i+1]+d[i+2])/3;
    if(avg<60){ d[i]=0; d[i+1]=255; d[i+2]=255; }
    else if(avg<120){ d[i]=22; d[i+1]=240; d[i+2]=167; }
  }
  ctx.putImageData(img,0,0);

  // result card
  resultEl.innerHTML = `
    <div style="border:1px solid #16f0a7;border-radius:12px;padding:12px;background:#101820">
      <div style="font-weight:700;color:#00e5ff;margin-bottom:6px">Scan Result</div>
      <div>Hand: <b>${side}</b></div>
      <div>Lighting: <b>${quality}</b> (avg=${light})</div>
      <div>Resolution: ${overlay.width}×${overlay.height}</div>
      <div style="opacity:.8;margin-top:6px">Tip: keep palm centered and fill frame for best detection.</div>
    </div>
  `;
  statusEl.textContent = "Done";
};

// simple beam animation
function scanBeam(ctx,w,h,durMs=600){
  return new Promise(res=>{
    const start=performance.now();
    (function tick(now){
      const t=Math.min(1,(now-start)/durMs);
      ctx.save();
      // darken
      ctx.fillStyle="rgba(0,0,0,0.35)";
      ctx.fillRect(0,0,w,h);
      // beam
      const y=t*h;
      const grd=ctx.createLinearGradient(0,y-40,0,y+40);
      grd.addColorStop(0,"rgba(0,229,255,0)");
      grd.addColorStop(.5,"rgba(0,229,255,0.75)");
      grd.addColorStop(1,"rgba(0,229,255,0)");
      ctx.fillStyle=grd;
      ctx.fillRect(0,y-40,w,80);
      ctx.restore();
      if(t<1) requestAnimationFrame(tick); else res();
    })(start);
  });
}

console.log("Quantum Palm Analyzer v4.7+ loaded");
