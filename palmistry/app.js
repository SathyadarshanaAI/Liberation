// app.js — Sathyadarshana Quantum Palm Analyzer V5.4
// ================================================

import { CameraCard } from './modules/camera.js';
import { emit } from './modules/bus.js';
import { I18N } from './modules/i18n.js';

// global DOM helper
const $ = id => document.getElementById(id);
window.$ = $;

// ==== STATUS ====
const statusEl = $('status');
const leftCv   = $('canvasLeft');
const rightCv  = $('canvasRight');

function setStatus(msg, ok=true){
  statusEl.textContent = msg;
  statusEl.style.color = ok ? '#16f0a7' : '#ff6b6b';
  emit("analyzer:status",{level:ok?"ok":"err",msg});
}

// ==== SETUP CAMERAS ====
let camLeft, camRight;

function setupCams(){
  camLeft  = new CameraCard($('camBoxLeft'),  { facingMode:'environment', onStatus:setStatus });
  camRight = new CameraCard($('camBoxRight'), { facingMode:'environment', onStatus:setStatus });

  $('startCamLeft').onclick  = ()=> { camLeft.start();  setStatus("📷 Left camera started"); };
  $('startCamRight').onclick = ()=> { camRight.start(); setStatus("📷 Right camera started"); };

  $('torchLeft').onclick  = ()=> camLeft.toggleTorch();
  $('torchRight').onclick = ()=> camRight.toggleTorch();

  $('uploadLeft').onclick  = ()=> filePickToCanvas(leftCv);
  $('uploadRight').onclick = ()=> filePickToCanvas(rightCv);
}

// ==== FILE PICK ====
async function filePickToCanvas(cv){
  const inp=document.createElement('input');
  inp.type='file'; inp.accept='image/*';
  inp.onchange=()=>{
    const f=inp.files?.[0]; if(!f) return;
    const img=new Image(); img.onload=()=>{
      cv.width=img.naturalWidth; cv.height=img.naturalHeight;
      cv.getContext('2d').drawImage(img,0,0,cv.width,cv.height);
      setStatus('🖼️ Image loaded');
    };
    img.src=URL.createObjectURL(f);
  };
  inp.click();
}

// ==== SCANNING OVERLAY ====
function showScanOverlay(cv){
  const {width:w,height:h} = cv;
  const overlay = document.createElement('canvas');
  overlay.width = w; overlay.height = h;
  overlay.style.position = 'absolute';
  overlay.style.top = cv.offsetTop + 'px';
  overlay.style.left = cv.offsetLeft + 'px';
  overlay.style.width = cv.offsetWidth + 'px';
  overlay.style.height = cv.offsetHeight + 'px';
  overlay.style.pointerEvents = 'none';
  overlay.style.borderRadius = '14px';
  overlay.className = 'scan-overlay';
  cv.parentNode.appendChild(overlay);
  const octx = overlay.getContext('2d');

  // beam overlay
  const beam = document.createElement('div');
  beam.className = 'scan-beam';
  beam.style.width = cv.offsetWidth + 'px';
  beam.style.height = '40px';
  beam.style.top = cv.offsetTop + 'px';
  beam.style.left = cv.offsetLeft + 'px';
  beam.style.position = 'absolute';
  beam.style.borderRadius = '4px';
  cv.parentNode.appendChild(beam);
  setTimeout(()=>beam.remove(),1600);

  // light sweep effect
  let y = 0;
  const scan = ()=>{
    octx.clearRect(0,0,w,h);
    const grad = octx.createLinearGradient(0,y,0,y+40);
    grad.addColorStop(0,'rgba(0,255,0,0)');
    grad.addColorStop(0.5,'rgba(0,255,0,0.7)');
    grad.addColorStop(1,'rgba(0,255,0,0)');
    octx.fillStyle = grad;
    octx.fillRect(0,y,w,40);
    y += 6;
    if(y < h){
      requestAnimationFrame(scan);
    } else {
      setTimeout(()=>overlay.remove(),300);
    }
  };
  scan();
}

// ==== CAPTURE BUTTONS WITH SCAN EFFECT ====
function overrideCapture(){
  $('captureLeft').onclick = ()=>{
    camLeft.captureTo(leftCv,{mirror:false,cover:true});
    showScanOverlay(leftCv);
    setStatus("🔍 Scanning left palm...");
    setTimeout(()=>setStatus("✅ Left palm captured"),1500);
  };
  $('captureRight').onclick = ()=>{
    camRight.captureTo(rightCv,{mirror:true,cover:true});
    showScanOverlay(rightCv);
    setStatus("🔍 Scanning right palm...");
    setTimeout(()=>setStatus("✅ Right palm captured"),1500);
  };
}

// ==== ANALYZER ====
function analyzeCanvas(cv){
  const ctx=cv.getContext('2d'); const {width:w,height:h}=cv;
  if(!w||!h) return {ok:false,msg:'No image'};
  const img=ctx.getImageData(0,0,w,h).data;
  let sum=0;
  for(let i=0;i<img.length;i+=4){
    const v=(img[i]*0.3+img[i+1]*0.59+img[i+2]*0.11);
    sum+=(v<90?1:0);
  }
  const density=(sum/(w*h))*100;
  return { ok:true, metrics:{density:+density.toFixed(2)}, report:`Line density ${density.toFixed(2)}%` };
}

$('analyze').onclick=()=>{
  setStatus("🪷 Analyzing...");
  const L=analyzeCanvas(leftCv);
  const R=analyzeCanvas(rightCv);
  $('insight').textContent=`LEFT → ${L.report}\nRIGHT → ${R.report}`;
  setStatus("✅ Analysis complete");
};

// ==== PDF SAVE ====
$('fullReport').onclick=()=>{
  const {jsPDF}=window.jspdf; const doc=new jsPDF({unit:'pt',format:'a4'});
  doc.text("Sathya Darshana · Quantum Palm Analyzer V5.4",40,50);
  doc.text($('insight').textContent||'No data.',40,80);
  doc.save('PalmReport.pdf');
  setStatus('📄 PDF saved');
};

// ==== SPEAK ====
$('speak').onclick=()=>{
  const txt=$('insight').textContent||"No analysis yet.";
  const u=new SpeechSynthesisUtterance(txt);
  u.lang=$('language').value||'en';
  speechSynthesis.speak(u);
  setStatus("🔊 Speaking…");
};

// ==== TRANSLATOR ====
function updateUI(lang){
  const ui = I18N[lang]?.ui || I18N.en.ui;
  $('title').textContent = ui.title + " V5.4";
  $('lblLanguage').textContent = ui.lang + ":";
  $('h3Left').textContent = ui.left;
  $('h3Right').textContent = ui.right;
  $('startCamLeft').textContent = ui.start;
  $('startCamRight').textContent = ui.start;
  $('captureLeft').textContent = ui.cap;
  $('captureRight').textContent = ui.cap;
  $('torchLeft').textContent = ui.torch;
  $('torchRight').textContent = ui.torch;
  $('uploadLeft').textContent = ui.upload;
  $('uploadRight').textContent = ui.upload;
  $('analyze').textContent = ui.analyze;
  $('fullReport').textContent = ui.full;
  $('speak').textContent = ui.speak;
  setStatus(ui.ready);
}

$('language').addEventListener('change', e=>{
  const lang=e.target.value;
  localStorage.setItem('lang',lang);
  updateUI(lang);
});

const savedLang = localStorage.getItem('lang') || 'en';
$('language').value = savedLang;
updateUI(savedLang);

// ==== INIT ====
window.addEventListener('DOMContentLoaded', ()=>{
  setupCams();
  overrideCapture();
  setStatus('🌿 Ready');
});
