/* Quantum Palm Analyzer v4.5.2 — JS only */
(() => {
'use strict';

/* ====== options dropdown ====== */
const optDrop = document.getElementById('optDrop');
document.getElementById('optBtn').onclick = () => optDrop.classList.toggle('open');
window.addEventListener('click', e => { if (!optDrop.contains(e.target)) optDrop.classList.remove('open'); });
document.getElementById('optGrid').onclick = () => {
  const box = document.getElementById('camBox');
  box.style.backgroundImage = box.style.backgroundImage ? '' :
  'linear-gradient(#00e5ff22 1px,transparent 1px),linear-gradient(90deg,#00e5ff22 1px,transparent 1px)';
  box.style.backgroundSize = '20px 20px';
};
document.getElementById('optClear').onclick = () => { localStorage.removeItem('palmistryResults'); alert('Saved results cleared.'); };
document.getElementById('optHelp').onclick = () => alert('Tip: good light, full palm in frame, include wrist lines. Use Upload if camera is blocked.');
document.getElementById('optAbout').onclick = () => alert('Quantum Palm Analyzer v4.5.2 — Unlocked PDF report.');

/* ====== storage & pair id ====== */
const PR_KEY = 'palmistryResults', PAIR_KEY = 'currentPairId';
const handSel = document.getElementById('handSel'), pairBadge = document.getElementById('pairBadge');
const prLoad = () => { try { return JSON.parse(localStorage.getItem(PR_KEY) || '[]'); } catch { return []; } };
const prSave = a => localStorage.setItem(PR_KEY, JSON.stringify(a));
const prAdd = o => { const a = prLoad(); a.push(o); prSave(a); };
const getPairId = () => localStorage.getItem(PAIR_KEY) || null;
const setPairId = id => { localStorage.setItem(PAIR_KEY, id); pairBadge.textContent = 'pair: ' + (id || '—'); };
(function initPairBadge(){ pairBadge.textContent = 'pair: ' + (getPairId() || '—'); })();

/* ====== camera ====== */
const video = document.getElementById('video');
const canvas = document.getElementById('canvas'); const ctx = canvas.getContext('2d');
const camBox = document.getElementById('camBox'); const statusBox = document.getElementById('status');
let mediaStream = null, camFacing = 'environment';

function sizeCanvas(){
  const r = camBox.getBoundingClientRect();
  const d = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = r.width * d; canvas.height = r.height * d;
}
new ResizeObserver(sizeCanvas).observe(camBox); sizeCanvas();

async function startCamera(){
  try{
    mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: camFacing } } });
    video.srcObject = mediaStream; video.hidden = false; statusBox.textContent = 'Camera active';
  }catch{ alert('Camera access failed'); }
}
document.getElementById('startCam').onclick = startCamera;

document.getElementById('switchBtn').onclick = async () => {
  camFacing = (camFacing === 'environment') ? 'user' : 'environment';
  await startCamera();
};

function track(){ return mediaStream?.getVideoTracks?.()[0] || video.srcObject?.getVideoTracks?.()[0] || null; }
document.getElementById('flashBtn').onclick = async () => {
  const t = track(); if (!t){ alert('Start camera first'); return; }
  const caps = t.getCapabilities ? t.getCapabilities() : {};
  if (!caps.torch){ alert('Torch not supported'); return; }
  const isOn = t.getSettings?.().torch;
  try{
    await t.applyConstraints({ advanced: [{ torch: !isOn }] });
    document.getElementById('flashBtn').textContent = (!isOn) ? '⚡ Flash ON' : '⚡ Flash';
  }catch{ alert('Torch control failed'); }
};

document.getElementById('capture').onclick = () => {
  if (!video.srcObject){ alert('Start camera first'); return; }
  sizeCanvas(); drawToCanvas(video);
};
document.getElementById('filePick').onchange = e => {
  const f = e.target.files[0]; if (!f) return;
  const img = new Image();
  img.onload = () => { sizeCanvas(); drawToCanvas(img); };
  img.src = URL.createObjectURL(f);
};

function drawToCanvas(src){
  const w = canvas.width, h = canvas.height;
  ctx.fillStyle = '#000'; ctx.fillRect(0,0,w,h);
  const sw = src.videoWidth || src.width, sh = src.videoHeight || src.height;
  const CR = w/h, R = sw/sh;
  let sx=0, sy=0, Ssw=sw, Ssh=sh;
  if (R > CR){ Ssh = sh; Ssw = Ssh * CR; sx = (sw - Ssw) / 2; }
  else{ Ssw = sw; Ssh = Ssw / CR; sy = (sh - Ssh) / 2; }
  ctx.drawImage(src, sx, sy, Ssw, Ssh, 0, 0, w, h);
  statusBox.textContent = 'Frame captured';
  runFrameQA();
}

/* ====== analyzer ====== */
const bars = [...Array(7)].map((_, i) => document.getElementById('b' + i));
let lastResult = null;

document.getElementById('analyze').onclick = () => {
  const pix = ctx.getImageData(0,0,canvas.width,canvas.height).data;
  if (!pix || !pix.length){ alert('Load an image first'); return; }
  let sum=0; for (let i=0;i<pix.length;i+=24) sum+=pix[i]+pix[i+1]+pix[i+2];
  const avg=sum/(pix.length/24);
  const conf=Math.min(99, Math.max(60, avg/4));
  document.getElementById('conf').textContent='Confidence ' + conf.toFixed(1) + '%';
  const sc=[80,74,70,60,66,75,55].map(v=>Math.min(100, v + (conf - 80)/2)).map(v=>Math.round(v));
  sc.forEach((v,i)=>bars[i].style.transform = `scaleX(${v/100})`);
  drawRadar(sc);
  lastResult = { confidence: Number(conf.toFixed(1)), lines: { heart:sc[0], mind:sc[1], life:sc[2], fate:sc[3], success:sc[4], health:sc[5], marriage:sc[6] } };
  document.getElementById('insight').textContent =
  `Confidence ${lastResult.confidence}% • Heart ${sc[0]} • Mind ${sc[1]} • Life ${sc[2]} • Fate ${sc[3]} • Success ${sc[4]} • Health ${sc[5]} • Marriage ${sc[6]} Insight: Balanced progress profile detected.`;
};

function drawRadar(a){
  const c=document.getElementById('radar'), g=c.getContext('2d');
  const w=c.width, h=c.height, cx=w/2, cy=h/2, R=Math.min(w,h)/2-18;
  g.clearRect(0,0,w,h);
  g.strokeStyle='#17324a'; g.lineWidth=1;
  for(let r=0.2;r<=1;r+=0.2){
    g.beginPath();
    for(let i=0;i<7;i++){
      const ang=i*2*Math.PI/7-Math.PI/2;
      const x=cx+Math.cos(ang)*R*r;
      const y=cy+Math.sin(ang)*R*r;
      i?g.lineTo(x,y):g.moveTo(x,y);
    }
    g.closePath(); g.stroke();
  }
  g.beginPath();
  for(let i=0;i<7;i++){
    const ang=i*2*Math.PI/7-Math.PI/2;
    const x=cx+Math.cos(ang)*R*(a[i]/100);
    const y=cy+Math.sin(ang)*R*(a[i]/100);
    i?g.lineTo(x,y):g.moveTo(x,y);
  }
  g.closePath(); g.fillStyle='rgba(22,240,167,.12)';
  g.fill(); g.strokeStyle='#16f0a7'; g.stroke();
}

/* ====== Save to local storage ====== */
document.getElementById('save').onclick=()=> {
  if (!lastResult){ alert('Analyze first'); return; }
  let pid = getPairId(); if (!pid){ pid = (crypto.randomUUID?.() || ('pair_'+Date.now().toString(36))); setPairId(pid); }
  const entry = { ts: Date.now(), pairId: pid, hand: handSel.value, thumb: canvas.toDataURL('image/jpeg',0.8),
    meta: { version:'4.5.2', confidence:lastResult.confidence }, lines: lastResult.lines };
  prAdd(entry); alert('Saved.');
};

/* ====== Pair Summary ====== */
function latestPairWithBoth(){
  const all = prLoad(), map = {};
  for (const r of all){
    const id = r.pairId || ('solo-'+r.ts);
    map[id] = map[id] || { id, left:null, right:null, ts:0 };
    if (r.hand==='left') map[id].left = r;
    if (r.hand==='right') map[id].right = r;
    map[id].ts = Math.max(map[id].ts, r.ts);
  }
  const groups = Object.values(map).filter(g=>g.left&&g.right).sort((a,b)=>b.ts-a.ts);
  return groups[0] || null;
}
function lineName(k){ return ({heart:'Heart',mind:'Mind',life:'Life',fate:'Fate',success:'Success',health:'Health',marriage:'Marriage'})[k] || k; }
function quickNarrative(rec,mode){
  const L = rec.lines || {}, keys = ['heart','mind','life','fate','success','health','marriage'];
  const sorted = keys.map(k=>[k,Number(L[k]||0)]).sort((a,b)=>b[1]-a[1]);
  const hi = sorted[0], lo = sorted.at(-1);
  const vti = Math.round(0.5*(L.life||0)+0.3*(L.success||0)+0.2*(L.health||0));
  return `Mode: ${mode} · Confidence ${rec.meta?.confidence??'—'}%
Vitality Index: ${vti}
Strongest → ${lineName(hi[0])} (${hi[1]})
Tender → ${lineName(lo[0])} (${lo[1]})
Care: keep routines; consult professionals for health decisions.`;
}
function renderPairSummary(){
  const pair = latestPairWithBoth(); const box = document.getElementById('pairSummary');
  if (!pair){ alert('Save both Left & Right first.'); return; }
  document.getElementById('sumLeft').src = pair.left.thumb;
  document.getElementById('sumRight').src = pair.right.thumb;
  document.getElementById('txtLeft').textContent = quickNarrative(pair.left, 'Past (Left)');
  document.getElementById('txtRight').textContent = quickNarrative(pair.right, 'Present (Right)');
  const keys = ['heart','mind','life','fate','success','health','marriage'];
  const deltas = keys.map(k => (pair.right.lines[k]||0) - (pair.left.lines[k]||0));
  const dk = Math.round(deltas.reduce((a,b)=>a+b,0)/deltas.length);
  document.getElementById('deltaBadge').textContent = `ΔK average change: ${dk>0?'+':''}${dk}`;
  box.style.display = 'block';
}
document.getElementById('summaryBtn').onclick = renderPairSummary;

/* ====== PDF (Full Report, unlocked) ====== */
document.getElementById('pdfBtn').onclick = async () => {
  if (!lastResult){ alert('Analyze first'); return; }
  await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js');
  const sc = lastResult.lines;
  const block = document.createElement('div');
  block.style.padding='20px'; block.style.fontFamily='Inter,system-ui,Arial'; block.style.color='#111';
  block.innerHTML = `
  <h1 style="margin:0 0 8px;color:#09c;">Quantum Palm Analyzer – Full Report</h1>
  <div style="font-size:12px;color:#555;margin-bottom:10px">
    Version 4.5.2 • ${new Date().toLocaleString()}
  </div>
  <img src="${canvas.toDataURL('image/jpeg',0.9)}" style="width:48%;border-radius:8px;border:1px solid #ddd" />
  <h3>Line Scores</h3>
  <ul style="line-height:1.6">
    <li>Heart: ${sc.heart}</li>
    <li>Mind: ${sc.mind}</li>
    <li>Life: ${sc.life}</li>
    <li>Fate: ${sc.fate}</li>
    <li>Success: ${sc.success}</li>
    <li>Health: ${sc.health}</li>
    <li>Marriage: ${sc.marriage}</li>
  </ul>
  <p>Confidence: ${lastResult.confidence}%</p>
  <p>Insight: Balanced progress profile with stable energy lines.</p>
  <hr/>
  <small>Note: Symbolic reading for education & research — not medical advice.</small>`;
  html2pdf().set({
    margin:10, filename:'QuantumPalmReport_v4.5.2.pdf',
    image:{type:'jpeg',quality:0.98},
    html2canvas:{scale:2,useCORS:true},
    jsPDF:{unit:'mm',format:'a4',orientation:'portrait'}
  }).from(block).save();
};
function loadScript(src){
  return new Promise((res,rej)=>{
    if (document.querySelector(`script[src="${src}"]`)) return res();
    const s=document.createElement('script'); s.src=src; s.onload=res; s.onerror=rej; document.body.appendChild(s);
  });
}

/* ====== QA checks ====== */
const notice = document.getElementById('notice'),
nText = document.getElementById('noticeText'),
nSwitch= document.getElementById('noticeSwitch'),
nOk = document.getElementById('noticeOk');
nOk.onclick = () => notice.style.display = 'none';
nSwitch.onclick = () => { handSel.value = (handSel.value==='left'?'right':'left'); notice.style.display = 'none'; };

function skinMask(img,w,h){
  const d=img.data, m=new Uint8Array(w*h);
  for(let i=0,p=0;i<w*h;i++,p+=4){
    const r=d[p], g=d[p+1], b=d[p+2];
    const Y=0.299*r+0.587*g+0.114*b;
    const Cr=(r-Y)*0.713+128, Cb=(b-Y)*0.564+128;
    m[i]=((Cr>135&&Cr<180&&Cb>85&&Cb<135)||(r>95&&g>40&&b>20&&r>g&&r>b)) ? 1 : 0;
  }
  return m;
}
function luminanceStats(img){
  const d=img.data; let s=0,s2=0;
  for(let i=0;i<d.length;i+=4){
    const y=0.299*d[i]+0.587*d[i+1]+0.114*d[i+2];
    s+=y; s2+=y*y;
  }
  const n=d.length/4, mu=s/n;
  return { mean:mu, std:Math.sqrt(Math.max(0,s2/n-mu*mu)) };
}
function coverage(mask,w,h){
  let c=0,l=1e9,r=-1,t=1e9,b=-1;
  for(let y=0,i=0;y<h;y++){
    for(let x=0;x<w;x++,i++){
      if(mask[i]){
        c++;
        if(x<l)l=x; if(x>r)r=x; if(y<t)t=y; if(y>b)b=y;
      }
    }
  }
  return { area:c/(w*h), touch:{ left:l<=w*0.02, right:r>=w*0.98, top:t<=h*0.02, bottom:b>=h*0.98 } };
}
function wristEnergy(img,w,h){
  const top=Math.floor(h*0.88); let e=0,c=0;
  for(let y=top;y<h-1;y++){
    for(let x=1;x<w-1;x++){
      const p=(y*w+x)*4;
      const gx=(img.data[p-4]-img.data[p+4]) + (img.data[p-4*w]-img.data[p+4*w]);
      const gy=(img.data[p-4*w]-img.data[p+4*w]) + (img.data[p-4*w-4]-img.data[p+4*w+4]);
      e+=Math.hypot(gx,gy); c++;
    }
  }
  return e/(c||1);
}
function thumbBulk(mask,w,h){
  const band=Math.floor(w*0.25); let L=0,R=0;
  for(let y=0,i=0;y<h;y++){
    for(let x=0;x<w;x++,i++){
      if(mask[i]){ if(x<band)L++; if(x>=w-band)R++; }
    }
  }
  if (L>R*1.25) return 'left-side-b
