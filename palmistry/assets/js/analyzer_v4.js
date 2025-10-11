import { addResult, getPairId, setPairId, newPairId } from './storage.js';

// DOM refs
const handSel = document.getElementById('hand');
const pairCode = document.getElementById('pairCode');
const newPairBtn = document.getElementById('newPair');
const reusePairBtn = document.getElementById('reusePair');
const startCamBtn = document.getElementById('startCam');
const capBtn = document.getElementById('capBtn');
const upload = document.getElementById('filePick');
const clearBtn = document.getElementById('clear');
const analyzeBtn = document.getElementById('analyze');
const saveBtn = document.getElementById('save');
const confBadge = document.getElementById('confBadge');
const bars = {
  heart: byId('bHeart'), head: byId('bHead'), life: byId('bLife'),
  fate: byId('bFate'), sun: byId('bSun'), mercury: byId('bMerc'), marriage: byId('bMar')
};
const typeBox = document.getElementById('typeBox');
const video = document.getElementById('video');
const canvas = document.getElementById('preview');
const ctx = canvas.getContext('2d');
const ph = document.getElementById('placeholder');

function byId(id){ return document.getElementById(id); }
function paintPair(){ pairCode.textContent = 'pair: ' + (getPairId() || '—'); }
paintPair();
newPairBtn.onclick = ()=>{ setPairId(newPairId()); paintPair(); };
reusePairBtn.onclick = ()=>{ if(!getPairId()) setPairId(newPairId()); paintPair(); };

// Camera / Upload
let stream=null;
startCamBtn.onclick = async ()=>{
  try{
    stream = await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'}});
    video.srcObject = stream; ph.textContent='Camera active — align your palm.';
  }catch{ alert('Camera access failed. Use Upload Photo.'); }
};
capBtn.onclick = ()=>{ if(!video.srcObject){alert('Start camera first.');return;} draw(video); };
upload.onchange = (e)=>{
  const f=e.target.files[0]; if(!f) return;
  const img=new Image(); img.onload=()=>draw(img); img.src=URL.createObjectURL(f);
};
clearBtn.onclick = ()=>{ ctx.clearRect(0,0,canvas.width,canvas.height); ph.textContent='Cleared.'; };
function draw(src){
  const w=canvas.width,h=canvas.height; ctx.fillStyle='#000'; ctx.fillRect(0,0,w,h);
  const sw=src.videoWidth||src.width, sh=src.videoHeight||src.height;
  const CR=w/h, R=sw/sh; let sx=0,sy=0, Ssw=sw,Ssh=sh;
  if(R>CR){ Ssh=sh; Ssw=Ssh*CR; sx=(sw-Ssw)/2; } else { Ssw=sw; Ssh=Ssw/CR; sy=(sh-Ssh)/2; }
  ctx.drawImage(src,sx,sy,Ssw,Ssh,0,0,w,h); ph.textContent='Frame captured.';
}

// Analyzer v4 (deterministic)
let lastResult=null;
analyzeBtn.onclick = ()=>{
  const pix = ctx.getImageData(0,0,canvas.width,canvas.height).data;
  let has=false; for(let i=0;i<pix.length;i+=64){ if(pix[i]|pix[i+1]|pix[i+2]){has=true;break;} }
  if(!has){ alert('Capture or upload a photo first.'); return; }
  const r = analyzeCanvas(); lastResult=r;
  confBadge.textContent = r.confidence+'%';
  for(const k of Object.keys(bars)){ bars[k].style.transform=`scaleX(${(r.lines[k].score||0)/100})`; }
  typeInsight(buildInsightText(r));
};

function analyzeCanvas(){
  const {width:w,height:h}=canvas;
  const img=ctx.getImageData(0,0,w,h), d=img.data;
  const gray=new Float32Array(w*h);
  for(let i=0,j=0;i<d.length;i+=4,j++){ gray[j]=0.299*d[i]+0.587*d[i+1]+0.114*d[i+2]; }
  const mag=new Float32Array(w*h);
  const KX=[-1,0,1,-2,0,2,-1,0,1], KY=[-1,-2,-1,0,0,0,1,2,1];
  for(let y=1;y<h-1;y++) for(let x=1;x<w-1;x++){
    let gx=0,gy=0,k=0; for(let yy=-1;yy<=1;yy++) for(let xx=-1;xx<=1;xx++,k++){
      const g=gray[(y+yy)*w+(x+xx)]; gx+=g*KX[k]; gy+=g*KY[k]; }
    mag[y*w+x]=Math.hypot(gx,gy);
  }
  let mean=0; for(let i=0;i<gray.length;i++) mean+=gray[i]; mean/=gray.length;
  let v=0; for(let i=0;i<gray.length;i++){ const dv=gray[i]-mean; v+=dv*dv; }
  const contrast=Math.sqrt(v/gray.length); let e=0; for(let i=0;i<mag.length;i++) e+=mag[i];
  const edgeMean=e/(mag.length||1);
  const conf=clamp(map(contrast,15,38,55,96)*0.6 + map(edgeMean,2,14,40,98)*0.4, 30, 98);

  const bands=7, arr=new Array(bands).fill(0);
  for(let y=0;y<h;y++){ const bi=Math.min(bands-1,Math.floor(y/h*bands)); let row=0; for(let x=0;x<w;x++) row+=mag[y*w+x]; arr[bi]+=row/w; }
  const mx=Math.max(...arr,1); const z=arr.map(v=>clamp((v/mx)*100,10,96));
  const mapIdx={heart:0,head:1,life:2,fate:3,sun:4,mercury:5,marriage:6}; const lines={};
  for(const [k,bi] of Object.entries(mapIdx)){ lines[k]={score:Math.round(clamp(0.65*z[bi]+0.35*conf,0,100))}; }
  return {confidence:Math.round(conf),lines};
}
function map(v,a,b,c,d){ const t=(v-a)/(b-a); return c+clamp(t,0,1)*(d-c); }
function clamp(v,a,b){ return Math.max(a,Math.min(b,v)); }

function buildInsightText(r){
  const L=r.lines;
  const hi=Object.entries(L).sort((a,b)=>b[1].score-a[1].score)[0][0];
  const lo=Object.entries(L).sort((a,b)=>a[1].score-b[1].score)[0][0];
  const N={heart:'Heart',head:'Head',life:'Life',fate:'Fate',sun:'Sun',mercury:'Mercury',marriage:'Marriage'};
  const mode=(handSel.value==='left')?'Past':'Present';
  return [
    `🜁 Mode: ${mode} · Confidence ${r.confidence}%`,
    `• Strongest → ${N[hi]} (${L[hi].score})`,
    `• Tender   → ${N[lo]} (${L[lo].score})`,
    `▸ Insight : Subtle progress emerging.`,
    `▸ Care    : Keep steady routines.`
  ].join('\n');
}
function typeInsight(text){
  typeBox.textContent=''; let i=0;
  (function tick(){ typeBox.textContent = text.slice(0,i++); if(i<=text.length) requestAnimationFrame(tick); })();
}

// Save
saveBtn.onclick = async ()=>{
  if(!lastResult){ alert('Run Analyze first.'); return; }
  let pairId=getPairId(); if(!pairId){ pairId=newPairId(); setPairId(pairId); paintPair(); }
  const whichHand=handSel.value;
  const thumb=canvas.toDataURL('image/jpeg',0.75);
  const L=lastResult.lines;
  const reportHTML = `
    <section><h3>${whichHand==='left'?'Past (Left)':'Present (Right)'} Reading</h3>
      <ul>
        <li>Heart: ${L.heart.score}</li><li>Head: ${L.head.score}</li>
        <li>Life: ${L.life.score}</li><li>Fate: ${L.fate.score}</li>
        <li>Sun: ${L.sun.score}</li><li>Mercury: ${L.mercury.score}</li>
        <li>Marriage: ${L.marriage.score}</li>
      </ul>
    </section>`.trim();
  addResult({
    ts: Date.now(), pairId, hand: whichHand, thumb,
    meta:{version:'4.0',confidence:lastResult.confidence},
    lines:lastResult.lines, reportHTML
  });
  saveBtn.classList.add('success'); setTimeout(()=>saveBtn.classList.remove('success'),1200);
  alert('Saved! Open Results to compare/export.');
};
