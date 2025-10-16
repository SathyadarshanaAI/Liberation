/* Palmistry AI v5.1e — Clarity Edition
   - Classic 3:4 camera window (object-fit:cover)
   - Lock Frame toggle
   - Segmentation (tight) + Wrist Boost + Black-Glass background
   - Canny + morph-close + Color overlays (Heart/Head/Life/Wrist)
   - Scan Light sweep
   - Auto Left/Right detection from mask
   - Torch (flash) attempt on snap
   - HD/4K getUserMedia targets
*/
const $ = id => document.getElementById(id);
const el = {
  video:$('video'), preview:$('preview'), overlay:$('overlay'),
  open:$('open'), lock:$('lock'), snap:$('snap'), save:$('save'), reset:$('reset'), close:$('close'),
  meta:$('meta'),
  opacity:$('opacity'), wboost:$('wboost'), t1:$('t1'), t2:$('t2'), thv:$('thv'), opv:$('opv'), wbv:$('wbv'),
  wristBox:$('wristBox'),
};

let stream=null, seg=null, latestMask=null, lastPNG=null, locked=false;
let __lastEdgesMat=null, scanRAF;

function setLabels(){
  $('opv').textContent = parseFloat(el.opacity.value).toFixed(2);
  $('wbv').textContent = parseInt(el.wboost.value,10);
  $('thv').textContent = `${el.t1.value}/${el.t2.value}`;
}
['opacity','wboost','t1','t2'].forEach(id=>$(id).addEventListener('input', setLabels)); setLabels();

/* ---------- Camera ---------- */
async function openCam(){
  const constraints = {
    audio:false,
    video:{
      facingMode:'environment',
      width:{ ideal:3840, max:3840 },   // 4K try
      height:{ ideal:2160, max:2160 },  // fallback automatic
      aspectRatio:{ ideal:0.75 }        // portrait feel
    }
  };
  stream = await navigator.mediaDevices.getUserMedia(constraints);
  el.video.srcObject = stream; await el.video.play();

  const w = el.video.videoWidth || 1920;
  const h = el.video.videoHeight || 1080;
  [el.preview, el.overlay].forEach(c=>{ c.width=w; c.height=h; });

  el.meta.textContent = `Camera open ${w}×${h}. Ready…`;
}
function closeCam(){ if(stream){stream.getTracks().forEach(t=>t.stop()); stream=null;} el.video.srcObject=null; el.meta.textContent='Closed.'; }
function resetAll(){ latestMask=null; lastPNG=null; if(__lastEdgesMat){__lastEdgesMat.delete(); __lastEdgesMat=null;} cancelAnimationFrame(scanRAF); [el.preview, el.overlay].forEach(c=>c.getContext('2d').clearRect(0,0,c.width,c.height)); el.meta.textContent='Reset.'; el.wristBox.textContent='—'; }

/* Torch (flash) toggle if supported */
async function trySetTorch(on){
  try{
    const track = stream && stream.getVideoTracks()[0];
    if(!track) return false;
    const caps = track.getCapabilities?.();
    if(!caps || !('torch' in caps)) return false;
    await track.applyConstraints({ advanced:[{ torch: !!on }]});
    return true;
  }catch(_){ return false; }
}

/* ---------- Segmentation ---------- */
async function ensureSeg(){
  if(seg) return seg;
  seg = new SelfieSegmentation({ locateFile:f=>`https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${f}` });
  seg.setOptions({ modelSelection:1 });
  await seg.initialize(); return seg;
}

async function drawMask(frame){
  const W=el.preview.width, H=el.preview.height;
  const ctx=el.preview.getContext('2d');
  ctx.drawImage(frame,0,0,W,H);

  const s = await ensureSeg();
  await new Promise((res)=>{
    s.onResults(r=>{
      const tmp=document.createElement('canvas'); tmp.width=W; tmp.height=H; const tctx=tmp.getContext('2d');
      tctx.drawImage(r.segmentationMask,0,0,W,H);
      const id=tctx.getImageData(0,0,W,H); const d=id.data;

      // binary mask
      for(let i=0;i<d.length;i+=4){ const a=d[i+3]; const on=a>90?255:0; d[i]=d[i+1]=d[i+2]=on; d[i+3]=255; }

      // small median-like smoothing to reduce blockiness
      for(let y=1;y<H-1;y++){
        for(let x=1;x<W-1;x++){
          const i=(y*W+x)*4;
          const avg=(d[i-4]+d[i+4]+d[i-W*4]+d[i+W*4]+d[i])/5;
          const val=avg>128?255:0; d[i]=d[i+1]=d[i+2]=val;
        }
      }

      // wrist boost (expand downward)
      const boost=parseInt(el.wboost.value,10);
      if(boost>0){
        for(let y=H-boost-1;y>=0;y--){
          for(let x=0;x<W;x++){
            const i=(y*W+x)*4;
            if(d[i]===255){
              for(let k=1;k<=boost;k++){ const yy=y+k; if(yy<H){ const j=(yy*W+x)*4; d[j]=d[j+1]=d[j+2]=255; } }
            }
          }
        }
      }
      latestMask=id;

      // BLACK-GLASS: darken outside hand; keep palm clear
      const framePix=ctx.getImageData(0,0,W,H);
      const fp=framePix.data, mp=id.data;
      const glassAlpha = Math.floor(255 * Math.min(Math.max(parseFloat(el.opacity.value)||0.3, 0.15), 0.95));
      for(let i=0;i<fp.length;i+=4){
        const on = mp[i]===255;
        if(!on){
          fp[i]=0; fp[i+1]=10; fp[i+2]=12; fp[i+3]=glassAlpha;
        }else{
          fp[i]=Math.min(fp[i]*1.05,255);
          fp[i+1]=Math.min(fp[i+1]*1.05,255);
          fp[i+2]=Math.min(fp[i+2]*1.05,255);
        }
      }
      ctx.putImageData(framePix,0,0);
      res();
    });
    s.send({image:frame});
  });
}

/* ---------- Edge pipeline ---------- */
function buildEdgesForColor(srcCtx,t1=35,t2=95){
  if(!window.__cvReady || !window.cv || !cv.Mat){ return null; }
  const W=srcCtx.canvas.width,H=srcCtx.canvas.height;
  let src=cv.imread(srcCtx.canvas);
  cv.cvtColor(src,src,cv.COLOR_RGBA2GRAY,0);
  cv.equalizeHist(src,src);
  cv.GaussianBlur(src,src,new cv.Size(5,5),0,0,cv.BORDER_DEFAULT);
  let edges=new cv.Mat();
  cv.Canny(src,edges,t1,t2,3,false);
  const k=cv.Mat.ones(3,3,cv.CV_8U); cv.morphologyEx(edges,edges,cv.MORPH_CLOSE,k); k.delete(); src.delete();
  return edges;
}

/* ---------- Color overlays ---------- */
function drawColoredPalmLines(edgesMat,ctx){
  const W=ctx.canvas.width,H=ctx.canvas.height;
  ctx.clearRect(0,0,W,H); if(!edgesMat) return;
  const tmp=new cv.Mat(); cv.cvtColor(edgesMat,tmp,cv.COLOR_GRAY2RGBA,0);
  const img=new ImageData(new Uint8ClampedArray(tmp.data),W,H); tmp.delete();
  const px=img.data;
  const B={ heart:[Math.floor(H*0.30),Math.floor(H*0.42)],
            head: [Math.floor(H*0.42),Math.floor(H*0.58)],
            life: [Math.floor(H*0.55),Math.floor(H*0.90)],
            wrist:[Math.floor(H*0.80),H-1] };
  const C={heart:'#ff4ef0', head:'#ffe066', life:'#16f0a7', wrist:'#33c9ff'};

  const draw=(n)=>{ const [y0,y1]=B[n]; ctx.strokeStyle=C[n]; ctx.lineWidth=(n==='wrist')?2.4:2.0; ctx.lineCap='round'; ctx.lineJoin='round';
    for(let y=y0;y<=y1;y+=2){ let run=false,sx=0; ctx.beginPath();
      for(let x=0;x<W;x++){ const i=(y*W+x)*4; const on = px[i]|px[i+1]|px[i+2];
        if(on && !run){ run=true; sx=x; ctx.moveTo(x,y); }
        else if(on && run){ ctx.lineTo(x,y); }
        else if(!on && run){ if(x-sx>30) ctx.stroke(); run=false; ctx.beginPath(); }
      }
      if(run && (W-sx)>30) ctx.stroke();
    }
  };
  ['heart','head','life','wrist'].forEach(draw);
}

/* ---------- Scan light bar ---------- */
function drawScanBar(ctx, t) {
  const W=ctx.canvas.width, H=ctx.canvas.height;
  const y = (t % 1200) / 1200 * H;          // 1.2s per sweep
  const g = ctx.createLinearGradient(0,y-30,0,y+30);
  g.addColorStop(0,   "rgba(0,0,0,0)");
  g.addColorStop(0.45,"rgba(255,255,255,0.06)");
  g.addColorStop(0.50,"rgba(0,255,255,0.25)");
  g.addColorStop(0.55,"rgba(255,255,255,0.06)");
  g.addColorStop(1,   "rgba(0,0,0,0)");
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.fillStyle = g;
  ctx.fillRect(0, y-40, W, 80);
  ctx.restore();
}
function startScanSweep(durationMs=1400){
  const octx = el.overlay.getContext('2d');
  const t0 = performance.now();
  const tick = (now)=>{
    drawColoredPalmLines(__lastEdgesMat, octx);
    drawScanBar(octx, now - t0);
    if(now - t0 < durationMs) scanRAF = requestAnimationFrame(tick);
  };
  cancelAnimationFrame(scanRAF);
  scanRAF = requestAnimationFrame(tick);
}

/* ---------- Wrist analysis ---------- */
function analyzeWristFromEdgeMap(edges,W,H){
  if(!edges) return {count:0,quality:'n/a',peaks:[]};
  const y0=Math.floor(H*0.82), y1=H-1;
  const hist=new Array(H).fill(0);
  for(let y=y0;y<=y1;y++){ let row=0; for(let x=0;x<W;x++){ row += edges.ucharPtr(y,x)[0]>0 ? 1 : 0; } hist[y]=row; }
  const peaks=[]; const minGap=6; let y=y0;
  while(y<=y1){
    let bestY=y,best=0; for(let k=0;k<5 && y+k<=y1;k++){ if(hist[y+k]>best){ best=hist[y+k]; bestY=y+k; } }
    if(best>Math.max(25, Math.floor(W*0.04))){ peaks.push({y:bestY,strength:best}); y=bestY+minGap; } else y++;
  }
  const count=Math.min(4,peaks.length);
  const clarity=peaks.map(p=>p.strength/W).reduce((a,b)=>a+b,0)/Math.max(1,peaks.length);
  const quality=clarity>0.25?'strong':clarity>0.15?'moderate':'weak';
  return {count,quality,peaks};
}
function lifespanFromWrist(count,strength){ let base=68; if(count===1) base=62; else if(count===2) base=70; else if(count===3) base=77; else if(count>=4) base=83; const adj=Math.floor((strength||0)*6); return {min:base-5+adj,max:base+7+adj}; }

/* ---------- Hand side detection (mask mass) ---------- */
function detectHandSideFromMask(mask, W, H){
  if(!mask) return "unknown";
  const d=mask.data; const y0=Math.floor(H*0.55), y1=Math.floor(H*0.90);
  let L=0,R=0;
  for(let y=y0;y<=y1;y++){
    for(let x=0;x<W;x++){
      const i=(y*W+x)*4; if(d[i]===255){ if(x<W*0.5) L++; else R++; }
    }
  }
  if(L>R*1.12) return "RIGHT hand";
  if(R>L*1.12) return "LEFT hand";
  return "unknown";
}

/* ---------- Lock frame ---------- */
function lockToggle(){
  if(!el.video.srcObject){ el.meta.textContent='Open the camera first.'; return; }
  const W=el.preview.width,H=el.preview.height; const p=el.preview.getContext('2d');
  if(!locked){
    p.globalAlpha=1; p.clearRect(0,0,W,H); p.drawImage(el.video,0,0,W,H);
    const track=stream&&stream.getVideoTracks()[0]; if(track) track.enabled=false;
    locked=true; el.lock.textContent='Unlock'; el.meta.textContent='Frame locked.';
  }else{
    const track=stream&&stream.getVideoTracks()[0]; if(track) track.enabled=true;
    locked=false; el.lock.textContent='Lock Frame'; el.meta.textContent='Live preview resumed.';
  }
}

/* ---------- Analyze ---------- */
async function snapAnalyze(){
  if(!(el.video.srcObject || locked)){ el.meta.textContent='Open the camera first.'; return; }
  const frameSrc = locked ? el.preview : el.video;

  // Torch ON briefly if supported
  const torchUsed = await trySetTorch(true);

  // Mask + black-glass
  await drawMask(frameSrc);
  const pctx=el.preview.getContext('2d');
  const b = avgBrightness(pctx);

  // Edges
  const src=document.createElement('canvas').getContext('2d');
  src.canvas.width=el.preview.width; src.canvas.height=el.preview.height;
  src.drawImage(frameSrc,0,0,src.canvas.width,src.canvas.height);
  const t1=parseInt(el.t1.value,10), t2=parseInt(el.t2.value,10);
  const edges=buildEdgesForColor(src,t1,t2);
  if(__lastEdgesMat) __lastEdgesMat.delete();
  __lastEdgesMat = edges;

  // Colored lines + scan bar
  drawColoredPalmLines(edges, el.overlay.getContext('2d'));
  startScanSweep(1400);

  // Reports
  const rep=analyzeWristFromEdgeMap(edges, el.overlay.width, el.overlay.height);
  const life=lifespanFromWrist(rep.count, rep.peaks.reduce((a,b)=>a+b.strength,0)/Math.max(1,rep.peaks.length)/el.overlay.width);
  const handSide = detectHandSideFromMask(latestMask, el.preview.width, el.preview.height);
  el.meta.innerHTML = `Hand: <b>${handSide}</b> · Lighting: <b>${b.label}</b> (avg=${b.avg}) · Resolution: ${el.preview.width}×${el.preview.height}`;
  el.wristBox.innerHTML = `Lines: <b>${rep.count}</b> (${rep.quality}) · Lifespan tendency: ${life.min}–${life.max} yrs`;

  // Compose PNG
  const snap=document.createElement('canvas'); snap.width=el.preview.width; snap.height=el.preview.height;
  const sc=snap.getContext('2d');
  sc.drawImage(frameSrc,0,0,snap.width,snap.height);
  sc.globalAlpha=1; sc.drawImage(el.preview,0,0);  // black-glass already applied
  sc.drawImage(el.overlay,0,0);
  lastPNG = snap.toDataURL('image/png');

  // Torch OFF after capture
  if(torchUsed){ setTimeout(()=>trySetTorch(false), 120); }
}

/* ---------- Utils ---------- */
function avgBrightness(ctx){
  const {width:w,height:h}=ctx.canvas; const d=ctx.getImageData(0,0,w,h).data;
  let s=0; for(let i=0;i<d.length;i+=4) s+=d[i]+d[i+1]+d[i+2];
  const avg=Math.round(s/(d.length/4)/3);
  const label=avg<90?'Dark':avg<120?'Dim':avg<170?'Bright':'Very Bright';
  return {avg,label};
}

/* Wire */
el.open.onclick=openCam;
el.close.onclick=closeCam;
el.reset.onclick=resetAll;
el.snap.onclick=snapAnalyze;
el.save.onclick=()=>{ if(!lastPNG){ alert('Take a Snap first.'); return; } const a=document.createElement('a'); a.href=lastPNG; a.download='palm_v5_1e.png'; a.click(); };
el.lock.onclick=lockToggle;