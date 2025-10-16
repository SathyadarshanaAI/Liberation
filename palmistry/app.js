/* Palmistry AI v5.1e — Final (HTTPS-safe) */
console.log("Palmistry v5.1e loaded");

const $=id=>document.getElementById(id);
const el={
  video:$('video'),preview:$('preview'),overlay:$('overlay'),
  open:$('open'),lock:$('lock'),snap:$('snap'),save:$('save'),reset:$('reset'),close:$('close'),
  meta:$('meta'),opacity:$('opacity'),wboost:$('wboost'),t1:$('t1'),t2:$('t2'),thv:$('thv'),opv:$('opv'),wbv:$('wbv'),
  wristBox:$('wristBox'),a4:$('a4')
};

let stream=null,seg=null,latestMask=null,lastPNG=null,locked=false;
let __lastEdgesMat=null,scanRAF;

function setLabels(){ el.opv.textContent=parseFloat(el.opacity.value).toFixed(2); el.wbv.textContent=parseInt(el.wboost.value,10); el.thv.textContent=`${el.t1.value}/${el.t2.value}`;}
['opacity','wboost','t1','t2'].forEach(id=>$(id).addEventListener('input',setLabels)); setLabels();

/* ================= Camera ================= */
async function openCam(){
  try{
    if (location.protocol !== "https:" && location.hostname !== "localhost") {
      throw new Error("Use HTTPS (e.g., GitHub Pages) or a secure tunnel for camera access.");
    }
    const constraints={
      audio:false,
      video:{facingMode:'environment',width:{ideal:3840,max:3840},height:{ideal:2160,max:2160},aspectRatio:{ideal:0.75}}
    };
    const st=await navigator.mediaDevices.getUserMedia(constraints);
    stream=st;
    el.video.srcObject=stream;
    await el.video.play();

    const w=el.video.videoWidth||1920, h=el.video.videoHeight||1080;
    [el.preview,el.overlay].forEach(c=>{c.width=w;c.height=h;});
    el.meta.textContent=`Camera open ${w}×${h}. Ready…`;
  }catch(err){
    console.error(err);
    const hint = (!navigator.mediaDevices?.getUserMedia)
      ? "This browser does not support camera APIs."
      : (location.protocol!=="https:" && location.hostname!=="localhost")
        ? "Not on HTTPS. Host on GitHub Pages or use a secure tunnel."
        : `${err.name||'Error'}: ${err.message}`;
    el.meta.textContent="Camera failed: "+hint;
    alert("Camera failed: "+hint);
  }
}
function closeCam(){ if(stream){stream.getTracks().forEach(t=>t.stop());stream=null;} el.video.srcObject=null; el.meta.textContent='Closed.'; }
function resetAll(){ latestMask=null; lastPNG=null; if(__lastEdgesMat){__lastEdgesMat.delete();__lastEdgesMat=null;} cancelAnimationFrame(scanRAF); [el.preview,el.overlay].forEach(c=>c.getContext('2d').clearRect(0,0,c.width,c.height)); el.meta.textContent='Reset.'; el.wristBox.textContent='—'; }

/* Torch (flash) toggle if supported */
async function trySetTorch(on){
  try{
    const track=stream && stream.getVideoTracks()[0];
    if(!track) return false;
    const caps=track.getCapabilities?.();
    if(!caps || !('torch' in caps)) return false;   // ← spacing fixed
    await track.applyConstraints({advanced:[{torch:!!on}]});
    return true;
  }catch(_){ return false; }
}

/* ================= Segmentation ================= */
async function ensureSeg(){ if(seg) return seg; seg=new SelfieSegmentation({locateFile:f=>`https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${f}`}); seg.setOptions({modelSelection:1}); await seg.initialize(); return seg; }
async function drawMask(frame){
  const W=el.preview.width,H=el.preview.height,ctx=el.preview.getContext('2d'); ctx.drawImage(frame,0,0,W,H);
  const s=await ensureSeg();
  await new Promise(res=>{
    s.onResults(r=>{
      const tmp=document.createElement('canvas'); tmp.width=W; tmp.height=H; const tctx=tmp.getContext('2d'); tctx.drawImage(r.segmentationMask,0,0,W,H);
      const id=tctx.getImageData(0,0,W,H),d=id.data;
      for(let i=0;i<d.length;i+=4){ const on=d[i+3]>90?255:0; d[i]=d[i+1]=d[i+2]=on; d[i+3]=255; }
      for(let y=1;y<H-1;y++){for(let x=1;x<W-1;x++){const i=(y*W+x)*4;const avg=(d[i-4]+d[i+4]+d[i-W*4]+d[i+W*4]+d[i])/5;const v=avg>128?255:0; d[i]=d[i+1]=d[i+2]=v;}}
      const boost=parseInt(el.wboost.value,10);
      if(boost>0){for(let y=H-boost-1;y>=0;y--){for(let x=0;x<W;x++){const i=(y*W+x)*4;if(d[i]===255){for(let k=1;k<=boost;k++){const yy=y+k;if(yy<H){const j=(yy*W+x)*4; d[j]=d[j+1]=d[j+2]=255;}}}}}
      latestMask=id;
      const fp=ctx.getImageData(0,0,W,H),p=fp.data,mp=id.data,ga=Math.floor(255*Math.min(Math.max(parseFloat(el.opacity.value)||0.3,0.15),0.95));
      for(let i=0;i<p.length;i+=4){ const on=mp[i]===255; if(!on){p[i]=0;p[i+1]=10;p[i+2]=12;p[i+3]=ga;} else {p[i]=Math.min(p[i]*1.05,255);p[i+1]=Math.min(p[i+1]*1.05,255);p[i+2]=Math.min(p[i+2]*1.05,255);} }
      ctx.putImageData(fp,0,0); res();
    }); s.send({image:frame});
  });
}

/* ================= Edges & Overlays ================= */
function buildEdgesForColor(srcCtx,t1=35,t2=95){
  if(!window.__cvReady||!window.cv||!cv.Mat) return null;
  const W=srcCtx.canvas.width,H=srcCtx.canvas.height; let src=cv.imread(srcCtx.canvas);
  cv.cvtColor(src,src,cv.COLOR_RGBA2GRAY,0); cv.equalizeHist(src,src); cv.GaussianBlur(src,src,new cv.Size(5,5),0,0,cv.BORDER_DEFAULT);
  let edges=new cv.Mat(); cv.Canny(src,edges,t1,t2,3,false);
  const k=cv.Mat.ones(3,3,cv.CV_8U); cv.morphologyEx(edges,edges,cv.MORPH_CLOSE,k); k.delete(); src.delete(); return edges;
}
function unsharpTo(ctx,amt=1.1){const W=ctx.canvas.width,H=ctx.canvas.height,id=ctx.getImageData(0,0,W,H),t=id.data,blur=new Uint8ClampedArray(t.length);for(let y=1;y<H-1;y++){for(let x=1;x<W-1;x++){const i=(y*W+x)*4;let r=0,g=0,b=0;for(let yy=-1;yy<=1;yy++)for(let xx=-1;xx<=1;xx++){const j=((y+yy)*W+(x+xx))*4;r+=t[j];g+=t[j+1];b+=t[j+2];}blur[i]=r/9;blur[i+1]=g/9;blur[i+2]=b/9;blur[i+3]=255;}}for(let i=0;i<t.length;i+=4){t[i]=Math.min(255,Math.max(0,t[i]+(t[i]-blur[i])*amt));t[i+1]=Math.min(255,Math.max(0,t[i+1]+(t[i+1]-blur[i+1])*amt));t[i+2]=Math.min(255,Math.max(0,t[i+2]+(t[i+2]-blur[i+2])*amt));}ctx.putImageData(id,0,0);}
function maskEdgesWithHand(m){ if(!latestMask||!m) return m; const W=el.preview.width,H=el.preview.height,d=latestMask.data; for(let y=0;y<H;y++)for(let x=0;x<W;x++) if(d[(y*W+x)*4]!==255) m.ucharPtr(y,x)[0]=0; return m; }
function drawColoredPalmLines(m,ctx){
  const W=ctx.canvas.width,H=ctx.canvas.height; ctx.clearRect(0,0,W,H); if(!m) return;
  const tmp=new cv.Mat(); cv.cvtColor(m,tmp,cv.COLOR_GRAY2RGBA,0); const img=new ImageData(new Uint8ClampedArray(tmp.data),W,H); tmp.delete();
  const px=img.data; const B={heart:[H*.30|0,H*.42|0],head:[H*.42|0,H*.58|0],life:[H*.55|0,H*.90|0],wrist:[H*.80|0,H-1]}, C={heart:'#ff4ef0',head:'#ffe066',life:'#16f0a7',wrist:'#33c9ff'};
  const draw=n=>{const[y0,y1]=B[n]; ctx.strokeStyle=C[n]; ctx.lineWidth=n==='wrist'?2.4:2.0; ctx.lineCap='round'; ctx.lineJoin='round';
    for(let y=y0;y<=y1;y+=2){let run=false,sx=0; ctx.beginPath(); for(let x=0;x<W;x++){const i=(y*W+x)*4,on=px[i]|px[i+1]|px[i+2]; if(on&&!run){run=true;sx=x;ctx.moveTo(x,y);} else if(on&&run){ctx.lineTo(x,y);} else if(!on&&run){if(x-sx>30) ctx.stroke(); run=false; ctx.beginPath();}} if(run&&(W-sx)>30) ctx.stroke();}
  }; ['heart','head','life','wrist'].forEach(draw);
}
function rrect(ctx,x,y,w,h,r=12){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();}
function drawPalmOutlineFromMask(ctx){
  if(!latestMask||!window.__cvReady) return; const W=ctx.canvas.width,H=ctx.canvas.height,bin=document.createElement('canvas'); bin.width=W; bin.height=H; bin.getContext('2d').putImageData(latestMask,0,0);
  let src=cv.imread(bin),gray=new cv.Mat(); cv.cvtColor(src,gray,cv.COLOR_RGBA2GRAY,0); let contours=new cv.MatVector(),hier=new cv.Mat(); cv.findContours(gray,contours,hier,cv.RETR_EXTERNAL,cv.CHAIN_APPROX_SIMPLE);
  let maxA=0,idx=-1; for(let i=0;i<contours.size();i++){const a=cv.contourArea(contours.get(i)); if(a>maxA){maxA=a;idx=i;}}
  if(idx>=0){const c=contours.get(idx); ctx.save(); ctx.strokeStyle='#00ffd0'; ctx.lineWidth=3; ctx.shadowColor='#00ffd0'; ctx.shadowBlur=12; ctx.beginPath(); for(let i=0;i<c.data32S.length;i+=2){const x=c.data32S[i],y=c.data32S[i+1]; if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);} ctx.closePath(); ctx.stroke(); ctx.restore();}
  src.delete(); gray.delete(); contours.delete(); hier.delete();
}
function drawA4Guides(ctx){
  if(!el.a4 || !el.a4.checked) return; const W=ctx.canvas.width,H=ctx.canvas.height,m=(W*0.04)|0, boxW=(W*0.40)|0, boxH=(H*0.44)|0;
  ctx.save();
  ctx.globalAlpha=.16; ctx.fillStyle='#1de9b6'; rrect(ctx,m,m,boxW,boxH,16); ctx.fill();
  ctx.globalAlpha=.7; ctx.setLineDash([8,6]); ctx.lineWidth=2; ctx.strokeStyle='#00e5ff'; rrect(ctx,m,m,boxW,boxH,16); ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha=.85; ctx.fillStyle='#9be8ff'; ctx.font=`${(W*0.035)|0}px system-ui`; ctx.fillText('LEFT hand here (top-left)', m+14, m+32);
  const rx=W-m-boxW, ry=m; ctx.globalAlpha=.16; ctx.fillStyle='#1de9b6'; rrect(ctx,rx,ry,boxW,boxH,16); ctx.fill();
  ctx.globalAlpha=.7; ctx.setLineDash([8,6]); ctx.lineWidth=2; ctx.strokeStyle='#00e5ff'; rrect(ctx,rx,ry,boxW,boxH,16); ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha=.85; ctx.fillStyle='#9be8ff'; ctx.fillText('RIGHT hand here (top-right)', rx+14, ry+32);
  const baseY=m+boxH+(H*0.04|0); ctx.globalAlpha=.4; ctx.setLineDash([10,8]); ctx.lineWidth=2; ctx.strokeStyle='#00e5ff'; ctx.beginPath(); ctx.moveTo(m,baseY); ctx.lineTo(W-m,baseY); ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha=.8; ctx.fillStyle='#9be8ff'; ctx.fillText('Analysis notes below (semi/full)', m+12, baseY+28);
  ctx.restore();
}

/* ================= Analysis & Utils ================= */
function analyzeWristFromEdgeMap(e,W,H){ if(!e) return {count:0,quality:'n/a',peaks:[]}; const y0=H*.82|0,y1=H-1,h=new Array(H).fill(0); for(let y=y0;y<=y1;y++){let r=0;for(let x=0;x<W;x++) r+=e.ucharPtr(y,x)[0]>0?1:0; h[y]=r;} const p=[],gap=6; let y=y0; while(y<=y1){let by=y,b=0;for(let k=0;k<5&&y+k<=y1;k++){if(h[y+k]>b){b=h[y+k];by=y+k;}} if(b>Math.max(25,W*0.04|0)){p.push({y:by,strength:b}); y=by+gap;} else y++;} const c=Math.min(4,p.length),cl=p.map(v=>v.strength/W).reduce((a,b)=>a+b,0)/Math.max(1,p.length),q=cl>.25?'strong':cl>.15?'moderate':'weak'; return {count:c,quality:q,peaks:p};}
function lifespanFromWrist(c,s){let base=68; if(c===1) base=62; else if(c===2) base=70; else if(c===3) base=77; else if(c>=4) base=83; const adj=Math.floor((s||0)*6); return {min:base-5+adj,max:base+7+adj};}
function detectHandSideFromMask(mask,W,H){ if(!mask) return 'unknown'; const d=mask.data,y0=H*.55|0,y1=H*.90|0; let L=0,R=0; for(let y=y0;y<=y1;y++) for(let x=0;x<W;x++){const i=(y*W+x)*4;if(d[i]===255){ if(x<W*0.5) L++; else R++; } } if(L>R*1.12) return 'RIGHT hand'; if(R>L*1.12) return 'LEFT hand'; return 'unknown';}
function avgBrightness(ctx){ const {width:w,height:h}=ctx.canvas,d=ctx.getImageData(0,0,w,h).data; let s=0; for(let i=0;i<d.length;i+=4) s+=d[i]+d[i+1]+d[i+2]; const a=Math.round(s/(d.length/4)/3); return {avg:a,label:a<90?'Dark':a<120?'Dim':a<170?'Bright':'Very Bright'}; }

/* ================= Lock & Analyze ================= */
function lockToggle(){ if(!el.video.srcObject){el.meta.textContent='Open the camera first.';return;} const W=el.preview.width,H=el.preview.height,p=el.preview.getContext('2d'); if(!locked){p.globalAlpha=1;p.clearRect(0,0,W,H);p.drawImage(el.video,0,0,W,H);const t=stream&&stream.getVideoTracks()[0]; if(t) t.enabled=false; locked=true; el.lock.textContent='Unlock'; el.meta.textContent='Frame locked.';} else {const t=stream&&stream.getVideoTracks()[0]; if(t) t.enabled=true; locked=false; el.lock.textContent='Lock Frame'; el.meta.textContent='Live preview resumed.';} }

async function snapAnalyze(){
  if(!(el.video.srcObject||locked)){ el.meta.textContent='Open the camera first.'; return; }
  const frameSrc=locked?el.preview:el.video;
  const torch=await trySetTorch(true);
  await drawMask(frameSrc);
  const pctx=el.preview.getContext('2d'),b=avgBrightness(pctx);

  const src=document.createElement('canvas').getContext('2d'); src.canvas.width=el.preview.width; src.canvas.height=el.preview.height; src.drawImage(frameSrc,0,0,src.canvas.width,src.canvas.height);
  unsharpTo(src,1.1);
  let edges=buildEdgesForColor(src,parseInt(el.t1.value,10),parseInt(el.t2.value,10));
  edges=maskEdgesWithHand(edges);
  if(__lastEdgesMat) __lastEdgesMat.delete(); __lastEdgesMat=edges;

  const octx=el.overlay.getContext('2d');
  drawColoredPalmLines(edges,octx);
  drawPalmOutlineFromMask(octx);
  drawA4Guides(octx);

  const rep=analyzeWristFromEdgeMap(edges,el.overlay.width,el.overlay.height);
  const life=lifespanFromWrist(rep.count,rep.peaks.reduce((a,v)=>a+v.strength,0)/Math.max(1,rep.peaks.length)/el.overlay.width);
  const side=detectHandSideFromMask(latestMask,el.preview.width,el.preview.height);
  el.meta.innerHTML=`Hand: <b>${side}</b> · Lighting: <b>${b.label}</b> (avg=${b.avg}) · Resolution: ${el.preview.width}×${el.preview.height}`;
  el.wristBox.innerHTML=`Lines: <b>${rep.count}</b> (${rep.quality}) · Lifespan tendency: ${life.min}–${life.max} yrs`;

  const snap=document.createElement('canvas'); snap.width=el.preview.width; snap.height=el.preview.height;
  const sc=snap.getContext('2d'); sc.drawImage(frameSrc,0,0,snap.width,snap.height); sc.globalAlpha=1; sc.drawImage(el.preview,0,0); sc.drawImage(el.overlay,0,0); lastPNG=snap.toDataURL('image/png');
  if(torch){ setTimeout(()=>trySetTorch(false),120); }
}

/* Wire */
el.open.onclick=openCam; el.close.onclick=closeCam; el.reset.onclick=resetAll; el.snap.onclick=snapAnalyze;
el.save.onclick=()=>{ if(!lastPNG){alert('Take a Snap first.');return;} const a=document.createElement('a'); a.href=lastPNG; a.download='palm_v5_1e.png'; a.click(); };
el.lock.onclick=lockToggle;