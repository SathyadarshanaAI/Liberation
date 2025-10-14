// app.js — Quantum Palm Analyzer v4.6 (auto hand detect + scan animation)
const $ = (s, r=document) => r.querySelector(s);
const statusEl=$("#status"), video=$("#video"), overlay=$("#overlay"), resultEl=$("#result");
const btnOpen=$("#open"), btnSnap=$("#snap"), btnClose=$("#close");

let stream;
let scanning = false;

const setStatus=t=>statusEl.textContent=t;
const secureOK=()=>location.protocol==="https:"||["localhost","127.0.0.1"].includes(location.hostname);

// ───────────────────────────────────────────────────────────────────────────────
// Basic camera controls
// ───────────────────────────────────────────────────────────────────────────────
btnOpen.onclick = async () => {
  if (!secureOK()) { setStatus("Camera requires HTTPS or localhost."); alert("Use HTTPS or localhost."); return; }
  try{
    setStatus("Requesting camera…");
    stream=await navigator.mediaDevices.getUserMedia({
      video:{ facingMode:"environment", width:{ideal:1280}, height:{ideal:720}},
      audio:false
    });
    video.srcObject=stream; await video.play();
    btnSnap.disabled=false; setTimeout(()=>btnClose.disabled=false,300);
    setStatus("Camera ON. Hold your palm steady. Fill the frame.");
  }catch(e){ console.warn(e); setStatus("Camera error: "+(e.message||e)); }
};

btnClose.onclick = () => {
  if(stream){ stream.getTracks().forEach(t=>t.stop()); stream=null; }
  video.srcObject=null; btnSnap.disabled=true; btnClose.disabled=true;
  setStatus("Camera OFF."); resultEl.innerHTML="";
};

// ───────────────────────────────────────────────────────────────────────────────
// Low-light enhancer (for dark scenes)
// ───────────────────────────────────────────────────────────────────────────────
function enhance(ctx, w, h, brightness=40, contrast=1.4){
  const img=ctx.getImageData(0,0,w,h), d=img.data;
  for(let i=0;i<d.length;i+=4){
    d[i]   = Math.min(255, (d[i]-128)*contrast + 128 + brightness);
    d[i+1] = Math.min(255, (d[i+1]-128)*contrast + 128 + brightness);
    d[i+2] = Math.min(255, (d[i+2]-128)*contrast + 128 + brightness);
  }
  ctx.putImageData(img,0,0);
}

// ───────────────────────────────────────────────────────────────────────────────
// Edge map + quick metrics (used for overlay + counts)
// ───────────────────────────────────────────────────────────────────────────────
function edgeMap(ctx, w, h){
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
  return {edges, luma};
}

// ───────────────────────────────────────────────────────────────────────────────
// Very-lightweight skin mask (YCbCr-ish heuristic)
// ───────────────────────────────────────────────────────────────────────────────
function skinMask(ctx, w, h){
  const img=ctx.getImageData(0,0,w,h), d=img.data;
  const mask=new Uint8Array(w*h);
  for(let y=0;y<h;y++){
    for(let x=0;x<w;x++){
      const i=(y*w+x)*4;
      const R=d[i], G=d[i+1], B=d[i+2];
      // quick YCbCr-like threshold (broad; works well enough for palm area mass)
      const Cb = (-0.168736*R -0.331264*G + 0.5*B) + 128;
      const Cr = ( 0.5*R -0.418688*G -0.081312*B) + 128;
      const isSkin = (Cr>135 && Cr<180 && Cb>85 && Cb<135); // permissive
      mask[y*w+x] = isSkin ? 1 : 0;
    }
  }
  return mask;
}

// ───────────────────────────────────────────────────────────────────────────────
// Auto-detect LEFT/RIGHT by thumb side:
//  - If thumb mass is LEFT side of image → it's the RIGHT hand (palm facing camera)
//  - If thumb mass is RIGHT side of image → it's the LEFT hand
// ───────────────────────────────────────────────────────────────────────────────
function detectHandSide(ctx, w, h){
  // downscale columns: aggregate skin mask mass on left 25% vs right 25%
  const mask = skinMask(ctx,w,h);
  const band = Math.round(w*0.25);
  let leftSum=0, rightSum=0;
  for(let y=0;y<h;y++){
    for(let x=0;x<band;x++) leftSum += mask[y*w + x];
    for(let x=w-band;x<w;x++) rightSum += mask[y*w + x];
  }
  const thumbSide = leftSum>rightSum ? "left" : "right";
  const hand = thumbSide==="left" ? "RIGHT" : "LEFT";
  const confidence = Math.min(0.99, Math.max(leftSum,rightSum) / (h*band)); // 0..1-ish
  return {hand, thumbSide, confidence: +(confidence.toFixed(2))};
}

// ───────────────────────────────────────────────────────────────────────────────
// Neon overlay of strong edges
// ───────────────────────────────────────────────────────────────────────────────
function drawNeonEdges(ctx, edges, w, h, TH=220){
  ctx.lineWidth = 1.4; ctx.strokeStyle = "#00e5ff"; ctx.globalAlpha=0.9; ctx.beginPath();
  for (let y=1;y<h-1;y+=2){
    for(let x=1;x<w-1;x+=2){
      const i=y*w+x; if (edges[i] > TH){ ctx.moveTo(x,y); ctx.lineTo(x+0.6,y+0.6); }
    }
  }
  ctx.stroke(); ctx.globalAlpha=1;
}

// ───────────────────────────────────────────────────────────────────────────────
// Scan-line animation + analysis
// ───────────────────────────────────────────────────────────────────────────────
async function scanAnalyze(){
  if(!video.videoWidth){ setStatus("Waiting for video…"); return; }
  if(scanning) return;
  scanning = true;
  resultEl.innerHTML = "";
  setStatus("Analyzing… scanning from top to bottom");

  // prepare overlay canvas
  const w = overlay.width  = video.videoWidth;
  const h = overlay.height = video.videoHeight;
  overlay.style.display = "block";
  const ctx = overlay.getContext("2d");

  // snapshot current frame
  ctx.drawImage(video, 0, 0, w, h);

  // enhance low light a bit
  enhance(ctx, w, h, 40, 1.35);

  // get edges & metrics once (we still animate scan bar)
  const {edges, luma} = edgeMap(ctx, w, h);

  // draw neon edges (base)
  drawNeonEdges(ctx, edges, w, h, 215);

  // scanning bar animation
  const barH = Math.max(6, Math.floor(h * 0.02));
  let y = -barH, startTs=null, duration=1200; // ~1.2s visual scan
  await new Promise((resolve)=>{
    const step = (ts)=>{
      if(!startTs) startTs = ts;
      const t = Math.min(1, (ts - startTs) / duration);
      y = Math.floor(t * (h + barH)) - barH;

      // redraw base (edges already drawn), overlay scan bar
      ctx.save();
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(0,229,255,0.25)";
      ctx.fillRect(0, y, w, barH);
      // scan border
      ctx.strokeStyle="#16f0a7"; ctx.lineWidth=2;
      ctx.strokeRect(1, y+1, w-2, barH-2);
      ctx.restore();

      // progress text
      const pct = Math.round(t*100);
      setStatus(`Analyzing… ${pct}%`);

      if(t<1) requestAnimationFrame(step);
      else resolve();
    };
    requestAnimationFrame(step);
  });

  // compute rough quality & line count
  const meanLuma = luma.reduce((a,b)=>a+b,0)/(w*h);
  let strong=0; for(let i=0;i<edges.length;i++) if(edges[i]>220) strong++;
  const lineDensity = strong/(w*h); // 0..1
  const quality = meanLuma<50 ? "Low light" : meanLuma>200 ? "Overexposed" : "OK";
  const estLines = Math.max(3, Math.min(12, Math.round(lineDensity*90))); // rough

  // auto hand detect
  const handInfo = detectHandSide(ctx, w, h);

  // show result
  resultEl.innerHTML = `
    <div style="background:#101820;border:1px solid #223;border-radius:14px;padding:12px">
      <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
        <span style="background:#00e5ff22;color:#00e5ff;border:1px solid #00e5ff;padding:4px 10px;border-radius:999px;font-weight:700">
          ${handInfo.hand} HAND <small>(thumb:${handInfo.thumbSide}, conf:${handInfo.confidence})</small>
        </span>
        <span style="background:#16f0a722;color:#16f0a7;border:1px solid #16f0a7;padding:4px 10px;border-radius:999px">
          Scan complete
        </span>
      </div>

      <ul style="margin:10px 0 0 18px;line-height:1.5">
        <li><b>Image quality:</b> ${quality} (mean brightness ≈ ${Math.round(meanLuma)})</li>
        <li><b>Edge density (approx. line richness):</b> ${ (lineDensity*100).toFixed(1) }%</li>
        <li><b>Estimated major lines found:</b> ~${estLines}</li>
      </ul>

      <p style="opacity:.9;margin:10px 0 0">
        Next: map Heart/Head/Life/Fate/Sun paths and generate the textual reading.
      </p>
    </div>
  `;

  setStatus("Analysis finished.");
  scanning = false;
}

// ───────────────────────────────────────────────────────────────────────────────
// Bind
// ───────────────────────────────────────────────────────────────────────────────
btnSnap.onclick = scanAnalyze;

console.log("✅ QPA v4.6 loaded (auto hand detect + scan animation)");
