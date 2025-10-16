/* v5.1d Classic Camera Window
   - Proper 3:4 portrait feed with object-fit:cover (no stretch)
   - Lock Frame toggle
   - Mediapipe segmentation (tight) + Wrist Boost
   - Canny + morph-close + Color overlays (Heart/Head/Life/Wrist)
   - Wrist summary + lifespan heuristic (demo)
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

function setLabels(){
  $('opv').textContent = parseFloat(el.opacity.value).toFixed(2);
  $('wbv').textContent = parseInt(el.wboost.value,10);
  $('thv').textContent = `${el.t1.value}/${el.t2.value}`;
}
['opacity','wboost','t1','t2'].forEach(id=>$(id).addEventListener('input', setLabels));
setLabels();

/* CAMERA open with better constraints (classic v5 feel) */
async function openCam(){
  const constraints = {
    audio:false,
    video:{
      facingMode:'environment',
      width:  { ideal: 480 },
      height: { ideal: 640 },
      aspectRatio: { ideal: 0.75 },      // 3:4 portrait
      focusMode: "continuous"            // browsers that support
    }
  };
  stream = await navigator.mediaDevices.getUserMedia(constraints);
  el.video.srcObject = stream;
  await el.video.play();

  // Resize canvases to the actual feed dimensions
  const w = el.video.videoWidth || 480;
  const h = el.video.videoHeight || 640;
  [el.preview, el.overlay].forEach(c=>{ c.width=w; c.height=h; });

  // Small try: lock continuous AE/AF where available
  try{
    const track = stream.getVideoTracks()[0];
    await track.applyConstraints({ advanced: [{ exposureMode:'continuous', focusMode:'continuous' }] });
  }catch(_){ /* ignore */ }

  el.meta.textContent = `Camera open ${w}×${h}. Ready…`;
}

function closeCam(){ if(stream){stream.getTracks().forEach(t=>t.stop()); stream=null;} el.video.srcObject=null; el.meta.textContent='Closed.'; }
function resetAll(){ latestMask=null; lastPNG=null; [el.preview, el.overlay].forEach(c=>c.getContext('2d').clearRect(0,0,c.width,c.height)); el.meta.textContent='Reset.'; el.wristBox.textContent='—'; }

/* ---- Segmentation ---- */
async function ensureSeg(){ if(seg) return seg; seg = new SelfieSegmentation({locateFile:f=>`https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${f}`}); seg.setOptions({modelSelection:1}); await seg.initialize(); return seg; }

async function drawMask(frame){
  const W=el.preview.width,H=el.preview.height; const ctx=el.preview.getContext('2d');
  ctx.drawImage(frame,0,0,W,H);
  const s=await ensureSeg();
  await new Promise((res)=>{
    s.onResults(r=>{
      const tmp=document.createElement('canvas'); tmp.width=W; tmp.height=H; const tctx=tmp.getContext('2d');
      tctx.drawImage(r.segmentationMask,0,0,W,H);
      const id=tctx.getImageData(0,0,W,H); const d=id.data;

      // binary + tighten
      for(let i=0;i<d.length;i+=4){ const a=d[i+3]; const on=a>90?255:0; d[i]=d[i+1]=d[i+2]=on; d[i+3]=255; }

      // wrist boost (expand downward N px)
      const boost=parseInt(el.wboost.value,10);
      if(boost>0){
        for(let y=H-boost-1;y>=0;y--){
          for(let x=0;x<W;x++){
            const i=(y*W+x)*4; if(d[i]===255){
              for(let k=1;k<=boost;k++){ const yy=y+k; if(yy<H){ const j=(yy*W+x)*4; d[j]=d[j+1]=d[j+2]=255; } }
            }
          }
        }
      }
      latestMask = id;

      // teal background tint
      const framePix=ctx.getImageData(0,0,W,H); const fp=framePix.data; const mp=id.data; const op=parseFloat(el.opacity.value);
      for(let i=0;i<fp.length;i+=4){ const on = mp[i]===255; if(!on){ fp[i]=Math.max(fp[i]-10,0); fp[i+1]=Math.max(fp[i+1],220); fp[i+2]=Math.max(fp[i+2],200); fp[i+3]=Math.floor(255*op); } }
      ctx.putImageData(framePix,0,0);
      res();
    });
    s.send({image:frame});
  });
}

/* ---- Edge pipeline ---- */
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

/* ---- Color overlay drawing ---- */
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
      for(let x=0;x<W;x++){ const i=(y*W+x)*4; const on=px[i]|px[i+1]|px[i+2];
        if(on && !run){ run=true; sx=x; ctx.moveTo(x,y); }
        else if(on && run){ ctx.lineTo(x,y); }
        else if(!on && run){ if(x-sx>30) ctx.stroke(); run=false; ctx.beginPath(); }
      }
      if(run && (W-sx)>30) ctx.stroke();
    }
  };
  ['heart','head','life','wrist'].forEach(draw);
}

/* ---- Wrist analysis ---- */
function analyzeWristFromEdgeMap(edges,W,H){
  if(!edges) return {count:0,quality:'n/a',peaks:[]};
  const y0=Math.floor(H*0.82), y1=H-1;
  const hist=new Array(H).fill(0);
  for(let y=y0;y<=y1;y++){ let row=0; for(let x=0;x<W;x++){ row+=edges.ucharPtr(y,x)[0]>0?1:0; } hist[y]=row; }
  const peaks=[]; const minGap=6; let y=y0;
  while(y<=y1){ let bestY=y,best=0; for(let k=0;k<5&&y+k<=y1;k++){ if(hist[y+k]>best){ best=hist[y+k]; bestY=y+k; } }
    if(best>Math.max(25,Math.floor(W*0.04))){ peaks.push({y:bestY,strength:best}); y=bestY+minGap; } else y++; }
  const count=Math.min(4,peaks.length);
  const clarity=peaks.map(p=>p.strength/W).reduce((a,b)=>a+b,0)/Math.max(1,peaks.length);
  const quality=clarity>0.25?'strong':clarity>0.15?'moderate':'weak';
  return {count,quality,peaks};
}
function lifespanFromWrist(count,strength){ let base=68; if(count===1) base=62; else if(count===2) base=70; else if(count===3) base=77; else if(count>=4) base=83; const adj=Math.floor((strength||0)*6); return {min:base-5+adj,max:base+7+adj}; }

/* ---- Lock frame ---- */
function lockToggle(){
  if(!el.video.srcObject){ el.meta.textContent='Open the camera first.'; return; }
  const W=el.preview.width,H=el.preview.height; const p=el.preview.getContext('2d');
  if(!locked){
    p.globalAlpha=1; p.clearRect(0,0,W,H); p.drawImage(el.video,0,0,W,H);
    const track=stream && stream.getVideoTracks()[0]; if(track) track.enabled=false;
    locked=true; el.lock.textContent='Unlock'; el.meta.textContent='Frame locked.';
  }else{
    const track=stream && stream.getVideoTracks()[0]; if(track) track.enabled=true;
    locked=false; el.lock.textContent='Lock Frame'; el.meta.textContent='Live preview resumed.';
  }
}

/* ---- Analyze ---- */
async function snapAnalyze(){
  if(!(el.video.srcObject || locked)){ el.meta.textContent='Open the camera first.'; return; }
  const frameSrc = locked ? el.preview : el.video;

  // mask + tint
  await drawMask(frameSrc);
  const pctx=el.preview.getContext('2d');
  const b = avgBrightness(pctx);
  el.meta.innerHTML = `Lighting: <b>${b.label}</b> (avg=${b.avg}) · Resolution: ${el.preview.width}×${el.preview.height}`;

  // edges from source frame
  const src=document.createElement('canvas').getContext('2d');
  src.canvas.width=el.preview.width; src.canvas.height=el.preview.height;
  src.drawImage(frameSrc,0,0,src.canvas.width,src.canvas.height);
  const t1=parseInt(el.t1.value,10), t2=parseInt(el.t2.value,10);
  const edges=buildEdgesForColor(src,t1,t2);

  // draw overlays
  drawColoredPalmLines(edges, el.overlay.getContext('2d'));

  // wrist report
  const rep=analyzeWristFromEdgeMap(edges, el.overlay.width, el.overlay.height);
  const life=lifespanFromWrist(rep.count, rep.peaks.reduce((a,b)=>a+b.strength,0)/Math.max(1,rep.peaks.length)/el.overlay.width);
  el.wristBox.innerHTML = `Lines: <b>${rep.count}</b> (${rep.quality}) · Peaks: ${rep.peaks.map(p=>`y${p.y}`).join(', ')||'—'}<br/>Lifespan tendency: ${life.min}–${life.max} yrs (demo heuristic)`;

  // build PNG + show frozen result on preview
  const snap=document.createElement('canvas'); snap.width=el.preview.width; snap.height=el.preview.height;
  const sc=snap.getContext('2d');
  sc.drawImage(frameSrc,0,0,snap.width,snap.height);
  sc.globalAlpha=parseFloat(el.opacity.value); sc.drawImage(el.preview,0,0); sc.globalAlpha=1;
  sc.drawImage(el.overlay,0,0);
  lastPNG = snap.toDataURL('image/png');
  const img=new Image(); img.onload=()=>pctx.drawImage(img,0,0,el.preview.width,el.preview.height); img.src=lastPNG;

  if(edges) edges.delete();
}

/* ---- Utils ---- */
function avgBrightness(ctx){
  const {width:w,height:h}=ctx.canvas; const d=ctx.getImageData(0,0,w,h).data;
  let s=0; for(let i=0;i<d.length;i+=4) s+=d[i]+d[i+1]+d[i+2];
  const avg=Math.round(s/(d.length/4)/3);
  const label = avg<90?'Dark':avg<120?'Dim':avg<170?'Bright':'Very Bright';
  return {avg,label};
}

/* Wire */
el.open.onclick=openCam;
el.close.onclick=closeCam;
el.reset.onclick=resetAll;
el.snap.onclick=snapAnalyze;
el.save.onclick=()=>{ if(!lastPNG){ alert('Take a Snap first.'); return; } const a=document.createElement('a'); a.href=lastPNG; a.download='palm_v5_1d.png'; a.click(); };
el.lock.onclick=lockToggle;