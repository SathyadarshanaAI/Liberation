// app.js — Quantum Palm Analyzer v4.7
const $ = (s, r=document) => r.querySelector(s);

// UI refs
const statusEl=$("#status"), video=$("#video"), overlay=$("#overlay"), resultEl=$("#result");
const btnOpen=$("#open"), btnSnap=$("#snap"), btnClose=$("#close");
const ctlBright=$("#ctl-bright"), ctlContrast=$("#ctl-contrast"), ctlDebug=$("#ctl-debug");

let stream, scanning=false;

// config
const CFG = {
  scanMs: 1200,
  edgeTH: 215,
  estMin: 3,
  estMax: 12
};

const setStatus=t=>statusEl.textContent=t;
const secureOK=()=>location.protocol==="https:"||["localhost","127.0.0.1"].includes(location.hostname);

// ── Camera ────────────────────────────────────────────────────────────────────
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

// ── Enhance + Edges ───────────────────────────────────────────────────────────
function enhance(ctx,w,h,brightness,contrast){
  const img=ctx.getImageData(0,0,w,h), d=img.data;
  for(let i=0;i<d.length;i+=4){
    d[i]   = Math.min(255, Math.max(0, (d[i]-128)*contrast + 128 + brightness));
    d[i+1] = Math.min(255, Math.max(0, (d[i+1]-128)*contrast + 128 + brightness));
    d[i+2] = Math.min(255, Math.max(0, (d[i+2]-128)*contrast + 128 + brightness));
  }
  ctx.putImageData(img,0,0);
}

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
  const band=Math.round(w*0.25);
  let leftSum=0,rightSum=0;
  for(let y=0;y<h;y++){
    for(let x=0;x<band;x++) leftSum += mask[y*w+x];
    for(let x=w-band;x<w;x++) rightSum += mask[y*w+x];
  }
  const thumbSide = leftSum>rightSum ? "left" : "right";
  const hand = thumbSide==="left" ? "RIGHT" : "LEFT";
  const confidence = Math.min(0.99, Math.max(leftSum,rightSum)/(h*band));
  return {hand,thumbSide,confidence:+confidence.toFixed(2)};
}

function drawNeonEdges(ctx,edges,w,h,TH){
  ctx.lineWidth=1.4; ctx.strokeStyle="#00e5ff"; ctx.globalAlpha=.9; ctx.beginPath();
  for(let y=1;y<h-1;y+=2){ for(let x=1;x<w-1;x+=2){
    const i=y*w+x; if(edges[i]>TH){ ctx.moveTo(x,y); ctx.lineTo(x+.6,y+.6); }
  }}
  ctx.stroke(); ctx.globalAlpha=1;
}

// ── Line bands & detection (fast heuristic) ────────────────────────────────────
// Band ratios based on typical palm proportions (tune later with data)
const BANDS = {
  heart: 0.28, // from top
  head : 0.42,
  life : 0.62, // curved; we just sample a band region
  fate : 0.50, // vertical-ish: we sample columnwise later
  sun  : 0.36
};

function analyzeBands(edges,w,h,debugCtx){
  // Helper to scan a horizontal band: get strongest contiguous run
  function scanRowBand(y0, pad=6){
    const y = Math.max(1, Math.min(h-2, Math.round(y0)));
    const x0 = Math.max(1, Math.round(w*0.08)), x1 = Math.min(w-2, Math.round(w*0.92));
    let bestLen=0, bestStart=-1, sumX=0, sumY=0, n=0;
    let curLen=0, curStart=x0;
    const THs=CFG.edgeTH;

    for(let x=x0; x<=x1; x++){
      const i=y*w+x;
      if(edges[i]>THs){
        if(curLen===0) curStart=x;
        curLen++; sumX+=x; sumY+=y; n++;
      }else{
        if(curLen>bestLen){ bestLen=curLen; bestStart=curStart; }
        curLen=0;
      }
    }
    if(curLen>bestLen){ bestLen=curLen; bestStart=curStart; }

    let strength = bestLen/(x1-x0);
    return { y, bestLen, bestStart, strength, centroid: n?{x:sumX/n,y:sumY/n}:null };
  }

  // Rough vertical scan for fate line (center columns)
  function scanColBand(x0){
    const x = Math.max(1, Math.min(w-2, Math.round(x0)));
    const y0 = Math.round(h*0.2), y1 = Math.round(h*0.85);
    let bestLen=0, curLen=0, bestStart=-1;
    for(let y=y0;y<=y1;y++){
      const i=y*w+x;
      if(edges[i]>CFG.edgeTH){ if(curLen===0) bestStart=y; curLen++; }
      else { if(curLen>bestLen){ bestLen=curLen; } curLen=0; }
    }
    if(curLen>bestLen) bestLen=curLen;
    const strength = bestLen/(y1-y0);
    return { x, bestLen, strength };
  }

  const res = {};
  // Heart / Head / Sun (horizontal-ish)
  for(const [name, ry] of Object.entries({heart:BANDS.heart, head:BANDS.head, sun:BANDS.sun})){
    const row = scanRowBand(ry*h);
    res[name] = {
      y: row.y,
      strength: +(row.strength*100).toFixed(1),
      grade: row.strength>0.22 ? "strong" : row.strength>0.12 ? "moderate" : "weak",
      centroid: row.centroid
    };
    if(debugCtx){
      debugCtx.strokeStyle = name==="heart" ? "#ff478a" : name==="head" ? "#00ff90" : "#ffd54a";
      debugCtx.lineWidth=2; debugCtx.beginPath();
      debugCtx.moveTo(Math.round(w*0.08), row.y);
      debugCtx.lineTo(Math.round(w*0.92), row.y);
      debugCtx.stroke();
    }
  }
  // Life (lower curved area → we still use a lower band proxy)
  const lifeRow = scanRowBand(BANDS.life*h);
  res.life = {
    y: lifeRow.y,
    strength: +(lifeRow.strength*100).toFixed(1),
    grade: lifeRow.strength>0.20 ? "strong" : lifeRow.strength>0.10 ? "moderate" : "weak",
    centroid: lifeRow.centroid
  };
  if(debugCtx){
    debugCtx.strokeStyle="#16f0a7"; debugCtx.lineWidth=2; debugCtx.beginPath();
    debugCtx.moveTo(Math.round(w*0.1), lifeRow.y);
    debugCtx.lineTo(Math.round(w*0.9), lifeRow.y);
    debugCtx.stroke();
  }
  // Fate (vertical-ish near center)
  const fateCol = scanColBand(w*0.54);
  res.fate = {
    x: fateCol.x,
    strength: +(fateCol.strength*100).toFixed(1),
    grade: fateCol.strength>0.20 ? "strong" : fateCol.strength>0.10 ? "moderate" : "weak"
  };
  if(debugCtx){
    debugCtx.strokeStyle="#4ac1ff"; debugCtx.lineWidth=2; debugCtx.beginPath();
    debugCtx.moveTo(fateCol.x, Math.round(h*0.2));
    debugCtx.lineTo(fateCol.x, Math.round(h*0.85));
    debugCtx.stroke();
  }
  return res;
}

function buildReading(lines, handInfo){
  const txt = (name,g)=> {
    const label = name[0].toUpperCase()+name.slice(1);
    const meaningStrong = {
      heart:"Warm, expressive emotional life; bonds matter.",
      head:"Clear reasoning; focused and practical.",
      life:"Robust vitality; steady stamina.",
      fate:"Strong sense of direction; consistent career path.",
      sun :"Creativity and recognition potential."
    }[name];
    const meaningWeak = {
      heart:"More reserved with emotions or fluctuating moods.",
      head:"Ideas may wander; try structured planning.",
      life:"Energy varies; prioritize rest and routine.",
      fate:"Flexible path; opportunities appear in cycles.",
      sun :"Quiet talents; build confidence and showcase work."
    }[name];
    return `<li><b>${label}:</b> <i>${g}</i> — ${g==="strong"?meaningStrong:meaningWeak}</li>`;
  };

  return `
    <h3 style="margin:12px 0 6px">Reading (${handInfo.hand} hand)</h3>
    <ul style="margin:6px 0 0 18px;line-height:1.5">
      ${txt("heart", lines.heart.grade)}
      ${txt("head" , lines.head.grade )}
      ${txt("life" , lines.life.grade )}
      ${txt("fate" , lines.fate.grade )}
      ${txt("sun"  , lines.sun.grade  )}
    </ul>
  `;
}

// ── Scan + analyze with animation ─────────────────────────────────────────────
async function scanAnalyze(){
  if(!video.videoWidth){ setStatus("Waiting for video…"); return; }
  if(scanning) return; scanning=true; resultEl.innerHTML="";
  setStatus("Analyzing… scanning from top to bottom");

  const w=overlay.width=video.videoWidth, h=overlay.height=video.videoHeight;
  overlay.style.display="block";
  const ctx=overlay.getContext("2d");

  // snapshot
  ctx.drawImage(video,0,0,w,h);
  // enhance by user sliders
  const brightness = parseInt(ctlBright?.value ?? "40",10);
  const contrast = parseFloat(ctlContrast?.value ?? "1.35");
  enhance(ctx,w,h,brightness,contrast);

  // edges
  const {edges,luma}=edgeMap(ctx,w,h);
  drawNeonEdges(ctx,edges,w,h,CFG.edgeTH);

  // scan bar anim
  const barH=Math.max(6,Math.floor(h*.02));
  let start=null;
  await new Promise(resolve=>{
    const step=(ts)=>{
      if(!start) start=ts;
      const t=Math.min(1,(ts-start)/CFG.scanMs);
      const y=Math.floor(t*(h+barH))-barH;

      ctx.save();
      ctx.globalCompositeOperation="source-over";
      ctx.fillStyle="rgba(0,229,255,.25)";
      ctx.fillRect(0,y,w,barH);
      ctx.strokeStyle="#16f0a7"; ctx.lineWidth=2;
      ctx.strokeRect(1,y+1,w-2,barH-2);
      ctx.restore();

      setStatus(`Analyzing… ${Math.round(t*100)}%`);
      if(t<1) requestAnimationFrame(step); else resolve();
    };
    requestAnimationFrame(step);
  });

  // metrics
  const meanLuma = luma.reduce((a,b)=>a+b,0)/(w*h);
  let strong=0; for(let i=0;i<edges.length;i++) if(edges[i]>220) strong++;
  const lineDensity = strong/(w*h);
  const quality = meanLuma<50 ? "Low light" : meanLuma>200 ? "Overexposed" : "OK";
  const estLines = Math.max(CFG.estMin, Math.min(CFG.estMax, Math.round(lineDensity*90)));

  // auto hand
  const handInfo = detectHandSide(ctx,w,h);

  // line bands
  const dbgCtx = ctlDebug?.checked ? ctx : null;
  const lines = analyzeBands(edges,w,h,dbgCtx);

  // result card
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
        <li><b>Edge density:</b> ${(lineDensity*100).toFixed(1)}%</li>
        <li><b>Estimated major lines:</b> ~${estLines}</li>
        <li><b>Strengths (%):</b>
          Heart ${lines.heart.strength} · Head ${lines.head.strength} · Life ${lines.life.strength} · Fate ${lines.fate.strength} · Sun ${lines.sun.strength}
        </li>
      </ul>

      ${buildReading(lines, handInfo)}
      <p style="opacity:.8;margin:8px 0 0;font-size:.95em">
        (v4.7 heuristic demo — next step: proper ridge tracing & curve fit)
      </p>
    </div>
  `;

  setStatus("Analysis finished.");
  scanning=false;
}

btnSnap.onclick = scanAnalyze;

console.log("✅ QPA v4.7 loaded (auto hand detect + scan + 5-line heuristic)");
