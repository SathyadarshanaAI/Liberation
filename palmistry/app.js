// app.js — Sathya Darshana Quantum Palm Analyzer V5.1
// Import universal camera (make sure the file name matches)
import { CameraCard } from './modules/camera.clean.js';

// ---------- Element Refs ----------
const camBoxLeft   = document.getElementById('camBoxLeft');
const camBoxRight  = document.getElementById('camBoxRight');
const canvasLeft   = document.getElementById('canvasLeft');
const canvasRight  = document.getElementById('canvasRight');
const statusEl     = document.getElementById('status');
const insightEl    = document.getElementById('insight');
const langSelect   = document.getElementById('language');

// Buttons
const btnStartL    = document.getElementById('startCamLeft');
const btnStartR    = document.getElementById('startCamRight');
const btnCapL      = document.getElementById('captureLeft');
const btnCapR      = document.getElementById('captureRight');
const btnUpL       = document.getElementById('uploadLeft');
const btnUpR       = document.getElementById('uploadRight');
const btnTorchL    = document.getElementById('torchLeft');
const btnTorchR    = document.getElementById('torchRight');
const btnAnalyze   = document.getElementById('analyze');
const btnMini      = document.getElementById('miniReport');
const btnFullPDF   = document.getElementById('fullReport');
const btnSpeak     = document.getElementById('speak');

// ---------- State ----------
let camLeft, camRight;
let leftPalmAI = null, rightPalmAI = null;

// ---------- Utils ----------
function setStatus(msg){ if(statusEl) statusEl.textContent = msg; console.log('[STATUS]', msg); }

function ensureCanvasCoverStyles(cnv){
  Object.assign(cnv.style, {
    position:'absolute', inset:0, width:'100%', height:'100%', borderRadius:'16px', zIndex:2
  });
}

// ---------- App Init ----------
window.addEventListener('DOMContentLoaded', () => {
  // Camera instances
  camLeft  = new CameraCard(camBoxLeft,  { facingMode:'environment', onStatus:setStatus });
  camRight = new CameraCard(camBoxRight, { facingMode:'environment', onStatus:setStatus });

  // Framing & portrait
  camLeft.setFramePad(0.90);  camLeft.setOffsetY(-0.05);  camLeft.forcePortrait  = true;
  camRight.setFramePad(0.90); camRight.setOffsetY(-0.05); camRight.forcePortrait = true;

  // Start buttons
  btnStartL.onclick = async ()=>{ await camLeft.start();  setStatus('Left hand camera started.'); };
  btnStartR.onclick = async ()=>{ await camRight.start(); setStatus('Right hand camera started.'); };

  // Capture (Hi-Res + auto-portrait)
  btnCapL.onclick = async ()=>{
    await camLeft.captureHiRes(canvasLeft);
    ensureCanvasCoverStyles(canvasLeft);
    setStatus('Left hand captured.');
    await autoPalmAI(canvasLeft, 'left');
  };

  btnCapR.onclick = async ()=>{
    await camRight.captureHiRes(canvasRight);
    ensureCanvasCoverStyles(canvasRight);
    setStatus('Right hand captured.');
    await autoPalmAI(canvasRight, 'right');
  };

  // Uploads
  btnUpL.onclick = ()=> fileUpload(canvasLeft, async ()=>{ ensureCanvasCoverStyles(canvasLeft); await autoPalmAI(canvasLeft,'left'); });
  btnUpR.onclick = ()=> fileUpload(canvasRight, async ()=>{ ensureCanvasCoverStyles(canvasRight); await autoPalmAI(canvasRight,'right'); });

  // Torch buttons not used (hide safely)
  if (btnTorchL) btnTorchL.style.display = 'none';
  if (btnTorchR) btnTorchR.style.display = 'none';

  // Reports
  btnAnalyze.onclick = ()=>{
    if (leftPalmAI && rightPalmAI) showPalmInsight(leftPalmAI, rightPalmAI, 'full');
    else setStatus('Please capture/upload both hands first!');
  };

  btnMini.onclick = ()=>{
    if (leftPalmAI && rightPalmAI) showPalmInsight(leftPalmAI, rightPalmAI, 'mini');
    else setStatus('Please capture/upload both hands first!');
  };

  btnFullPDF.onclick = async ()=>{
    if (!(leftPalmAI && rightPalmAI)) { setStatus('Please capture/upload both hands first!'); return; }
    await exportPDF();
  };

  // Speak
  btnSpeak.onclick = ()=> speakText(insightEl?.textContent || '');
});

// ---------- Palm Line AI (demo) ----------
async function autoPalmAI(canvas, hand){
  try{
    setStatus('Detecting palm lines…');
    const aiResult = await fakePalmAI(canvas, hand);
    drawPalmLinesOnCanvas(canvas, aiResult.lines);
    if (hand==='left') leftPalmAI = aiResult; else rightPalmAI = aiResult;
    setStatus('Palm lines auto-drawn.');
  }catch(e){
    console.error(e);
    setStatus('Palm detection failed.');
  }
}

// Demo AI: generates sample lines + reading
async function fakePalmAI(canvas, hand='right'){
  const w = canvas.width || canvas.clientWidth || 600;
  const h = canvas.height || canvas.clientHeight || 800;
  const lines = [
    { name:'Heart Line', color:'#e11d48', main:true,  points:[[w*0.18,h*0.25],[w*0.82,h*0.27]] },
    { name:'Head Line',  color:'#2563eb', main:true,  points:[[w*0.25,h*0.42],[w*0.75,h*0.52]] },
    { name:'Life Line',  color:'#16a34a', main:true,  points:[[w*0.36,h*0.78],[w*0.22,h*0.98],[w*0.48,h*0.98]] },
    { name:'Fate Line',  color:'#7c3aed', main:false, points:[[w*0.50,h*0.20],[w*0.52,h*0.80]] },
    { name:'Marriage',   color:'#64748b', main:false, points:[[w*0.72,h*0.18],[w*0.75,h*0.26]] }
  ];
  const reading = [
    'Heart Line: Emotions, affection, compassion.',
    'Head Line: Intellect, decision-making, creativity.',
    'Life Line: Vitality, life changes, energy.',
    ...(hand==='left' ? ['Previous Life Traits: subconscious patterns, inheritances.']
                      : ['Current Life Traits: conscious choices and present path.'])
  ];
  return { hand, lines, reading };
}

// ---------- Drawing ----------
function drawPalmLinesOnCanvas(canvas, palmLines){
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  // keep the already-drawn photo; draw overlay lines
  ctx.save();
  palmLines.forEach(line=>{
    ctx.save();
    ctx.strokeStyle = line.color;
    ctx.lineWidth   = line.main ? 5 : 2;
    ctx.globalAlpha = line.main ? 1.0 : 0.75;
    if (!line.main) ctx.setLineDash([6,6]);
    ctx.beginPath();
    line.points.forEach(([x,y],i)=> i?ctx.lineTo(x,y):ctx.moveTo(x,y));
    ctx.stroke();
    ctx.restore();
  });
  ctx.restore();
}

// ---------- File Upload ----------
function fileUpload(targetCanvas, callback){
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = e=>{
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev=>{
      const img = new Image();
      img.onload = ()=>{
        // draw photo into canvas (contain fit into current camBox size)
        const boxW = targetCanvas.parentElement.clientWidth  || img.width;
        const boxH = targetCanvas.parentElement.clientHeight || img.height;
        const dpr  = Math.min(window.devicePixelRatio||1, 2);
        const W = Math.max(1, Math.round(boxW*dpr));
        const H = Math.max(1, Math.round(boxH*dpr));
        targetCanvas.width = W; targetCanvas.height = H;
        ensureCanvasCoverStyles(targetCanvas);

        const ctx = targetCanvas.getContext('2d');
        ctx.fillStyle = '#000'; ctx.fillRect(0,0,W,H);
        const s  = Math.min(W/img.width, H/img.height)*0.92; // small pad
        const dw = Math.round(img.width*s), dh = Math.round(img.height*s);
        const dx = Math.floor((W-dw)/2),  dy = Math.floor((H-dh)/2);
        ctx.drawImage(img, 0,0,img.width,img.height, dx,dy,dw,dh);

        setStatus('Photo loaded.');
        callback && callback();
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };
  input.click();
}

// ---------- Insight / Reports ----------
function showPalmInsight(left, right, mode='full'){
  let txt = 'Sathya Darshana Quantum Palm Analyzer V5.1\n\n';
  txt += 'Left Hand: Previous Life Traits\n';
  txt += left.reading.join('\n') + '\n\n';
  txt += 'Right Hand: Current Life Traits\n';
  txt += right.reading.join('\n') + '\n\n';
  if (mode==='mini') {
    txt += 'Mini Report: Most prominent lines analyzed above.\n';
  } else {
    txt += 'Full Report: See above for all detected lines.\n';
  }
  insightEl.textContent = txt;
}

async function exportPDF(){
  try{
    const jsPDF = window.jspdf?.jsPDF || window.jspdf?.default?.jsPDF || window.jsPDF;
    if (!jsPDF) { setStatus('PDF library not loaded.'); return; }
    const doc = new jsPDF({ unit:'pt', format:'a4' });

    // Title
    doc.setFontSize(16);
    doc.text('Sathya Darshana Quantum Palm Analyzer V5.1', 40, 40);

    // Insert canvases (if present)
    const yImg = 60, gap = 20, imgW = 240, imgH = 320;
    if (canvasLeft.width && canvasLeft.height) {
      const dataL = canvasLeft.toDataURL('image/jpeg', 0.9);
      doc.text('Left Hand', 40, yImg - 8);
      doc.addImage(dataL, 'JPEG', 40, yImg, imgW, imgH);
    }
    if (canvasRight.width && canvasRight.height) {
      const dataR = canvasRight.toDataURL('image/jpeg', 0.9);
      doc.text('Right Hand', 300, yImg - 8);
      doc.addImage(dataR, 'JPEG', 300, yImg, imgW, imgH);
    }

    // Insight text
    const textY = yImg + imgH + gap;
    const txt = insightEl.textContent || '';
    doc.setFontSize(12);
    const lines = doc.splitTextToSize(txt, 515);
    doc.text(lines, 40, textY);

    doc.save('Palmistry_Report.pdf');
    setStatus('PDF exported.');
  }catch(e){
    console.error(e);
    setStatus('PDF export failed.');
  }
}

// ---------- Speech ----------
function speakText(text){
  if (!text) { setStatus('Nothing to speak.'); return; }
  if (!('speechSynthesis' in window)) { setStatus('Speech not supported on this browser.'); return; }
  // Map language select → BCP-47 lang tag
  const langMap = {
    'en':'en-US','si':'si-LK','ta':'ta-IN','fr':'fr-FR','de':'de-DE','es':'es-ES',
    'zh-cn':'zh-CN','hi':'hi-IN','ar':'ar-SA','ja':'ja-JP','ru':'ru-RU','pt':'pt-PT',
    'ko':'ko-KR','it':'it-IT','tr':'tr-TR','id':'id-ID','nl':'nl-NL','sv':'sv-SE'
  };
  const code = langMap[(langSelect && langSelect.value) || 'en'] || 'en-US';
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = code;
  u.rate = 1.0; u.pitch = 1.0; u.volume = 1.0;
  speechSynthesis.speak(u);
  setStatus('Speaking…');
}

// ---------- Optional: simple mobile F12 hook (if you use your logger) ----------
try{ console.log('✅ app.js ready'); }catch{}
