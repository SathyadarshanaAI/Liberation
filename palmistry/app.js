/* Quantum Palm Analyzer v5.1 (Wrist Region Enhanced)
 * - Green mask tightened (less spill on wrist)
 * - Wrist (Rascetta) treated as a primary line
 * - Lightweight edge map using OpenCV.js (Canny)
 * - Bottom ROI scan to count/score wrist lines
 * - Long-form analysis text
 */

const els = {
  video:  document.getElementById('video'),
  canvas: document.getElementById('preview'),
  mask:   document.getElementById('mask'),
  edges:  document.getElementById('edges'),
  open:   document.getElementById('open'),
  snap:   document.getElementById('snap'),
  save:   document.getElementById('save'),
  reset:  document.getElementById('reset'),
  close:  document.getElementById('close'),
  showMask:  document.getElementById('showMask'),
  showEdges: document.getElementById('showEdges'),
  tightMask: document.getElementById('tightMask'),
  wristBoost:document.getElementById('wristBoost'),
  handMeta: document.getElementById('handMeta'),
  camMeta:  document.getElementById('camMeta'),
  tip:      document.getElementById('tip'),
  linesList:document.getElementById('linesList'),
  wristReport:document.getElementById('wristReport'),
};

let stream = null;
let lastSnap = null;

const state = {
  facingMode: 'environment',
  width:  640,
  height: 480,
  leftHand: true, // simple heuristic below
};

function setVis() {
  els.mask.style.display  = els.showMask.checked ? 'block' : 'none';
  els.edges.style.display = els.showEdges.checked ? 'block' : 'none';
}
els.showMask.onchange = setVis;
els.showEdges.onchange = setVis;

function avgBrightness(ctx, w, h){
  const {data} = ctx.getImageData(0,0,w,h);
  let s=0; for(let i=0;i<data.length;i+=4){ s+=data[i]+data[i+1]+data[i+2]; }
  return Math.round(s/(data.length/4)/3);
}

async function openCam(){
  if(stream) return;
  stream = await navigator.mediaDevices.getUserMedia({
    video:{facingMode:state.facingMode,width:{ideal:state.width},height:{ideal:state.height}},
    audio:false
  });
  els.video.srcObject = stream;
  await els.video.play();

  // sync canvases
  state.width  = els.video.videoWidth  || state.width;
  state.height = els.video.videoHeight || state.height;
  [els.canvas, els.mask, els.edges].forEach(c=>{ c.width=state.width; c.height=state.height; });

  drawLoop();
}

function closeCam(){
  if(!stream) return;
  stream.getTracks().forEach(t=>t.stop());
  stream=null;
}

function drawLoop(){
  if(!stream) return;
  const ctx = els.canvas.getContext('2d');
  ctx.drawImage(els.video,0,0,state.width,state.height);

  // Heuristic: left/right by thumb side (bright skin vs background edge contrast)
  // very cheap: sample left/right 10% bands to guess which side is thumb (brighter curve)
  const img = ctx.getImageData(0,0,state.width,state.height).data;
  const w=state.width,h=state.height, band=Math.floor(w*0.1);
  let l=0,r=0,cnt=0;
  for(let y=Math.floor(h*0.35);y<Math.floor(h*0.75);y+=4){
    for(let x=0;x<band;x+=2){ const i=(y*w+x)*4; l+=img[i]+img[i+1]+img[i+2]; cnt++; }
    for(let x=w-band;x<w;x+=2){ const i=(y*w+x)*4; r+=img[i]+img[i+1]+img[i+2]; }
  }
  state.leftHand = l<r; // thumb side often darker; this works enough for display purposes.

  // pseudo mask (tight): threshold on skin range + morphology lite
  const mctx = els.mask.getContext('2d');
  const mimg = mctx.createImageData(w,h);
  const tight = els.tightMask.checked;
  for(let i=0;i<img.length;i+=4){
    const R=img[i],G=img[i+1],B=img[i+2];
    // simple YCbCr-ish test (no heavy ML): works good for tight outline
    const y =  0.299*R + 0.587*G + 0.114*B;
    const cb = 128 - 0.168736*R - 0.331264*G + 0.5*B;
    const cr = 128 + 0.5*R - 0.418688*G - 0.081312*B;

    let ok = (cr>140 && cr<175 && cb>95 && cb<135 && y>65); // skin band
    if(tight){ ok = ok && (y>85); } // tighten near wrist/creases
    const g = ok ? 1 : 0;
    mimg.data[i] =  0;
    mimg.data[i+1] = g? 255:0; // green
    mimg.data[i+2] = g? 190:0;
    mimg.data[i+3] = g? 200:0;
  }
  mctx.putImageData(mimg,0,0);

  requestAnimationFrame(drawLoop);
}

function toPNG(canvas, name="palm.png"){
  const a=document.createElement('a');
  a.href=canvas.toDataURL('image/png');
  a.download=name;
  a.click();
}

function analyze(){
  const w=state.width,h=state.height;
  const ctx = els.canvas.getContext('2d');
  const maskCtx = els.mask.getContext('2d');
  const eCtx = els.edges.getContext('2d');

  // 1) build a masked ROI to suppress background before edges
  const frame = ctx.getImageData(0,0,w,h);
  const mask  = maskCtx.getImageData(0,0,w,h);
  for(let i=0;i<frame.data.length;i+=4){
    const a = mask.data[i+1]; // green channel as mask alphaish
    if(a<100){ // background — dim hard
      frame.data[i]*=0.2; frame.data[i+1]*=0.2; frame.data[i+2]*=0.2;
    }
  }
  ctx.putImageData(frame,0,0);

  // 2) OpenCV edges
  if(!window.cv || !cv.Mat){ 
    eCtx.clearRect(0,0,w,h);
    eCtx.fillStyle="#fff";
    eCtx.fillText("OpenCV.js not loaded yet. Try again.", 12, 18);
    return;
  }
  let src = cv.imread(els.canvas);
  cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
  // slight blur to reduce skin texture noise
  cv.GaussianBlur(src, src, new cv.Size(3,3), 0, 0, cv.BORDER_DEFAULT);
  // canny
  let edges = new cv.Mat();
  cv.Canny(src, edges, 40, 110, 3, false);
  // amplify wrist zone if requested
  if(els.wristBoost.checked){
    const y0 = Math.floor(h*0.80); // bottom 20%
    for(let y=y0; y<h; y++){
      for(let x=0; x<w; x++){
        const v = edges.ucharPtr(y,x)[0];
        if(v>0){ edges.ucharPtr(y,x)[0] = 255; }
      }
    }
  }
  cv.imshow(els.edges, edges);

  // 3) Wrist analysis — scan horizontal peaks in bottom band
  const report = analyzeWristFromEdgeMap(edges, w, h);
  // 4) Other primary lines (quick heuristic just for UI)
  const lines = estimatePrimaryLines(edges, w, h);

  // write meta
  const b = avgBrightness(ctx,w,h);
  els.handMeta.innerHTML = `
    <strong>Hand:</strong> ${state.leftHand? "LEFT":"RIGHT"} hand<br/>
  `;
  els.camMeta.innerHTML = `
    <strong>Lighting:</strong> ${b<90?"Dim":b<130?"Normal":"Bright"} (avg=${b}) · 
    <strong>Resolution:</strong> ${w}×${h}
  `;
  els.tip.textContent = "Tip: keep wrist fully visible; hold steady for 1–2 seconds before snapping.";
  els.linesList.innerHTML = `
    • Life line: <code class="kbd">${lines.life.score.toFixed(1)}</code> 
    • Head line: <code class="kbd">${lines.head.score.toFixed(1)}</code> 
    • Heart line: <code class="kbd">${lines.heart.score.toFixed(1)}</code><br/>
    • Fate/Sun (optional): <code class="kbd">${lines.other.toFixed(1)}</code><br/>
    • <b>Wrist lines</b>: <code class="kbd">${report.count}</code> (${report.quality})
  `;
  els.wristReport.innerHTML = longWristNarrative(report);

  // keep snapshot for saving
  lastSnap = ctx.getImageData(0,0,w,h);

  // cleanup
  src.delete(); edges.delete();
}

function analyzeWristFromEdgeMap(edges, w, h){
  // bottom 18% ROI
  const y0 = Math.floor(h*0.82), y1 = h-1;
  // collapse to 1D by summing horizontals
  const hist = new Array(h).fill(0);
  for(let y=y0;y<=y1;y++){
    let row=0;
    for(let x=0;x<w;x++){
      row += edges.ucharPtr(y,x)[0]>0 ? 1 : 0;
    }
    hist[y] = row;
  }
  // find peaks
  const peaks = [];
  const minGap = 6; // px between wrist lines
  let y = y0;
  while(y<=y1){
    let bestY=y, best=0;
    for(let k=0;k<5 && y+k<=y1;k++){
      if(hist[y+k]>best){ best=hist[y+k]; bestY=y+k; }
    }
    if(best>Math.max(25, Math.floor(w*0.04))){ // strong row
      peaks.push({y:bestY, strength:best});
      y = bestY + minGap;
    }else{
      y++;
    }
  }
  // score quality
  const count = Math.min(3, peaks.length); // we only report first 3
  const clarity = peaks.map(p=>p.strength/(w)).reduce((a,b)=>a+b,0)/Math.max(1,peaks.length);
  const quality = clarity>0.25 ? "strong" : clarity>0.15 ? "moderate" : "weak";

  return {count, quality, peaks};
}

function estimatePrimaryLines(edges, w, h){
  // very rough density sampling for demo/visual feedback
  const bandY = (a,b)=>[Math.floor(h*a),Math.floor(h*b)];
  const sumBand = (y0,y1)=>{
    let s=0,n=0;
    for(let y=y0;y<y1;y++){
      for(let x=Math.floor(w*0.15);x<Math.floor(w*0.85);x++){
        s += edges.ucharPtr(y,x)[0]>0?1:0; n++;
      }
    }
    return s/n;
  };
  const life = sumBand( ...bandY(0.55,0.95) );   // curve near thumb base
  const head = sumBand( ...bandY(0.45,0.62) );
  const heart= sumBand( ...bandY(0.30,0.45) );
  const other= sumBand( ...bandY(0.10,0.30) );
  return {
    life:{score:life*100},
    head:{score:head*100},
    heart:{score:heart*100},
    other:other*100
  };
}

function longWristNarrative(rep){
  const c = rep.count, q = rep.quality;
  let base = `Detected <b>${c}</b> wrist line${c===1?"":"s"} with <b>${q}</b> clarity. `;
  // Traditional narrative (non-medical, cultural)
  let meaning = "";
  if(c>=3){
    meaning = "Classical reading suggests sustained vitality and a tendency toward long, steady lifepath with layered responsibilities.";
  }else if(c===2){
    meaning = "Often associated with stable livelihood and balanced health patterns when supported by Life/Head lines.";
  }else if(c===1){
    meaning = "Focus on conserving energy and rhythm of rest; single rascetta can still indicate resilient longevity if deep and unbroken.";
  }else{
    meaning = "Wrist lines were faint in this capture; try brighter, even lighting with wrist fully inside the frame.";
  }
  const tips = `Capture tips: use plain background, keep wrist inside the frame, and gently flex the palm to make creases prominent.`;
  return `${base}<br/>${meaning}<br/><br/><i>${tips}</i>`;
}

// ==== UI wiring ====
els.open.onclick = openCam;
els.close.onclick = ()=>{ closeCam(); };
els.reset.onclick = ()=>{
  const ctx = els.canvas.getContext('2d');
  [els.canvas, els.mask, els.edges].forEach(c=> c.getContext('2d').clearRect(0,0,c.width,c.height));
  els.handMeta.textContent = els.camMeta.textContent = els.tip.textContent = "";
  els.linesList.textContent = els.wristReport.textContent = "";
  lastSnap=null;
};
els.snap.onclick  = analyze;
els.save.onclick  = ()=>{
  if(lastSnap){
    const ctx = els.canvas.getContext('2d');
    ctx.putImageData(lastSnap,0,0);
  }
  toPNG(els.canvas, `palm-v5.1-${state.leftHand?'L':'R'}.png`);
};

// initial visibility
setVis();