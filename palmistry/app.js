// app.js — Sathyadarshana Quantum Palm Analyzer V5.3

import { CameraCard } from './modules/camera.js';
import { emit } from './modules/bus.js';

const $ = id => document.getElementById(id);
const statusEl = $('status');
const leftCv   = $('canvasLeft');
const rightCv  = $('canvasRight');

function setStatus(msg, ok=true){
  statusEl.textContent = msg;
  statusEl.style.color = ok ? '#16f0a7' : '#ff6b6b';
  emit("analyzer:status", { level: ok?"ok":"err", msg });
}

// --- Analyzer feed bridge (logs → sideboot panel) ---
function logStatus(msg){ console.log(msg); emit("analyzer:status",{level:"info",msg}); }
function logStep(tag,msg){ console.log(`[STEP] ${tag}: ${msg}`); emit("analyzer:step",{tag,msg}); }
function logMetric(key,val){ console.log(`[METRIC] ${key} = ${val}`); emit("analyzer:metric",{key,val}); }

// --- setup cameras ---
let camLeft, camRight;
function setupCams(){
  camLeft  = new CameraCard($('camBoxLeft'),  { facingMode:'environment', onStatus:setStatus });
  camRight = new CameraCard($('camBoxRight'), { facingMode:'environment', onStatus:setStatus });

  $('startCamLeft').onclick  = ()=> { camLeft.start();  logStatus("📷 Left camera started");  };
  $('startCamRight').onclick = ()=> { camRight.start(); logStatus("📷 Right camera started"); };

  $('captureLeft').onclick  = ()=> { camLeft.captureTo(leftCv,{mirror:false,cover:true}); logStep("capture","Left hand captured"); };
  $('captureRight').onclick = ()=> { camRight.captureTo(rightCv,{mirror:true,cover:true}); logStep("capture","Right hand captured"); };

  $('torchLeft').onclick  = ()=> camLeft.toggleTorch();
  $('torchRight').onclick = ()=> camRight.toggleTorch();

  $('uploadLeft').onclick = ()=> filePickToCanvas(leftCv);
  $('uploadRight').onclick= ()=> filePickToCanvas(rightCv);
}

async function filePickToCanvas(cv){
  const inp=document.createElement('input');
  inp.type='file'; inp.accept='image/*';
  inp.onchange=()=>{
    const f=inp.files?.[0]; if(!f) return;
    const img=new Image(); img.onload=()=>{
      cv.width=img.naturalWidth; cv.height=img.naturalHeight;
      cv.getContext('2d').drawImage(img,0,0,cv.width,cv.height);
      setStatus('🖼️ Image loaded');
      logStep("upload","Manual image loaded");
    };
    img.src=URL.createObjectURL(f);
  };
  inp.click();
}

// --- simple mock analyzer ---
function analyzeCanvas(cv){
  const ctx=cv.getContext('2d'); const {width:w,height:h}=cv;
  if(!w||!h) return {ok:false,msg:'No image'};
  const img=ctx.getImageData(0,0,w,h).data;
  let sum=0;
  for(let i=0;i<img.length;i+=4){ const v=(img[i]*0.3+img[i+1]*0.59+img[i+2]*0.11); sum+=(v<90?1:0); }
  const density=(sum/(w*h))*100;
  return { ok:true, metrics:{density:+density.toFixed(2)}, report:`Line density ${density.toFixed(2)}%` };
}

// --- Analyze Button ---
$('analyze').onclick = async ()=>{
  logStatus("🪷 Analyzer started");
  const L=analyzeCanvas(leftCv);
  const R=analyzeCanvas(rightCv);
  logStep("capture","Left & Right analyzed");
  logMetric("clarity_left",L.metrics?.density||0);
  logMetric("clarity_right",R.metrics?.density||0);
  await new Promise(r=>setTimeout(r,600));
  logStep("features","Palm features extracted");
  await new Promise(r=>setTimeout(r,600));
  $('insight').textContent = `LEFT → ${L.report}\nRIGHT → ${R.report}`;
  setStatus("✅ Analysis complete");
  logStatus("✅ Analyzer finished successfully");
};

// --- PDF & Speak ---
$('fullReport').onclick=()=>{
  const {jsPDF}=window.jspdf; const doc=new jsPDF({unit:'pt',format:'a4'});
  doc.text("Sathya Darshana · Quantum Palm Analyzer V5.3",40,50);
  const txt=$('insight').textContent; doc.text(txt,40,80); doc.save('PalmReport.pdf');
  setStatus('📄 PDF saved'); logStep("report","PDF saved");
};
$('speak').onclick=()=>{
  const txt=$('insight').textContent||"No analysis yet.";
  const u=new SpeechSynthesisUtterance(txt); u.lang=$('language').value||'en';
  speechSynthesis.speak(u); setStatus("🔊 Speaking…"); logStep("voice","Speaking insight");
};

// --- Initialize all ---
setupCams();
logStatus("🌿 Ready");

// --- Optional: SideBoot auto import ---
(async ()=>{
  try{
    const sideboot=await import('./modules/sideboot.js');
    await sideboot.boot?.();
    setStatus('Modules: OK');
    logStatus("🧠 SideBoot connected");
  }catch(e){
    console.warn('SideBoot missing:',e);
    setStatus('Modules: OK (no-sideboot)');
  }
})();
