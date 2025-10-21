// --- Optional: SideBoot panel (no-crash if missing) ---
(async ()=>{
  const v='v=20251020a';
  try{
    const sideboot = await import(`./modules/sideboot.js?${v}`);
    await sideboot.boot?.();
    setStatus('Modules: OK');
  }catch(e){
    console.warn('SideBoot not loaded (optional):', e);
    setStatus('Modules: OK (no-sideboot)');
  }
})();
 // app.js  (place in /palmistry/app.js)
import { CameraCard, captureToCanvas } from './modules/camera.js';
const $ = (id)=>document.getElementById(id);
const statusEl = $('status');
const leftCv   = $('canvasLeft');
const rightCv  = $('canvasRight');

function setStatus(msg, ok=true){
  statusEl.textContent = msg;
  statusEl.style.color = ok ? '#16f0a7' : '#ff6b6b';
}

// --- setup cameras ---
let camLeft, camRight;
function setupCams(){
  camLeft  = new CameraCard($('camBoxLeft'),  { facingMode:'environment', onStatus:setStatus });
  camRight = new CameraCard($('camBoxRight'), { facingMode:'environment', onStatus:setStatus });

  $('startCamLeft').onclick  = ()=> camLeft.start();
  $('startCamRight').onclick = ()=> camRight.start();

  $('captureLeft').onclick  = ()=> camLeft.captureTo(leftCv,  { mirror:false, cover:true });
  $('captureRight').onclick = ()=> camRight.captureTo(rightCv, { mirror:true,  cover:true });

  $('torchLeft').onclick  = ()=> camLeft.toggleTorch();
  $('torchRight').onclick = ()=> camRight.toggleTorch();

  // upload → draw to canvas
  $('uploadLeft').onclick = ()=> filePickToCanvas(leftCv);
  $('uploadRight').onclick= ()=> filePickToCanvas(rightCv);
}

async function filePickToCanvas(cv){
  const inp = document.createElement('input');
  inp.type = 'file'; inp.accept = 'image/*';
  inp.onchange = async ()=>{
    const f = inp.files?.[0]; if(!f) return;
    const img = new Image(); img.onload = ()=>{
      cv.width = img.naturalWidth; cv.height = img.naturalHeight;
      cv.getContext('2d').drawImage(img,0,0,cv.width,cv.height);
      setStatus('🖼️ Image loaded');
    };
    img.src = URL.createObjectURL(f);
  };
  inp.click();
}

// --- Analyze / Reports (placeholder logic you can swap with real one) ---
function analyzeCanvas(cv){
  // very simple mock: returns line strengths by edge density
  const ctx = cv.getContext('2d');
  const { width:w, height:h } = cv;
  if(!w || !h){ return { ok:false, msg:'No image' }; }
  const img = ctx.getImageData(0,0,w,h).data;
  let sum=0;
  for(let i=0;i<img.length;i+=4){
    // crude edge-ish metric: high contrast channel
    const v = (img[i]*0.3+img[i+1]*0.59+img[i+2]*0.11);
    sum += (v<90?1:0);
  }
  const density = (sum/(w*h))*100;
  return {
    ok:true,
    metrics:{ density: +density.toFixed(2) },
    traits:{
      heart: density>18?'strong':'moderate',
      head:  density>22?'deep':'balanced',
      life:  density>26?'bold':'fine',
      fate:  density>20?'present':'subtle'
    },
    report:`Lines density ~ ${density.toFixed(2)}%`
  };
}

$('analyze').onclick = ()=>{
  const L = analyzeCanvas(leftCv);
  const R = analyzeCanvas(rightCv);
  let out = '';
  if(L.ok) out += `LEFT → ${L.report}\n${JSON.stringify(L.traits)}\n\n`;
  if(R.ok) out += `RIGHT → ${R.report}\n${JSON.stringify(R.traits)}\n`;
  $('insight').textContent = out || 'No image(s) to analyze.';
  setStatus('✅ Analyzed');
};

$('miniReport').onclick = ()=>{
  const txt = $('insight').textContent.trim();
  $('insight').textContent = txt ? txt : 'No analysis yet. Capture or Upload first.';
};

$('fullReport').onclick = ()=>{
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit:'pt', format:'a4' });
  doc.setFont('helvetica','bold'); doc.setFontSize(16);
  doc.text('Sathya Darshana · Quantum Palm Analyzer V5.3', 40, 50);

  const addImg = (cv, y, label)=>{
    if(!cv.width) return y;
    const data = cv.toDataURL('image/jpeg',0.92);
    doc.setFont('helvetica','normal'); doc.setFontSize(12);
    doc.text(label, 40, y); y+=8;
    const maxW = 515, maxH = 360;
    const r = Math.min(maxW/cv.width, maxH/cv.height);
    const w = cv.width*r, h = cv.height*r;
    doc.addImage(data,'JPEG',40,y,w,h); y+=h+16;
    return y;
  };

  let y = 80;
  y = addImg(leftCv,  y, 'Left Hand');
  y = addImg(rightCv, y, 'Right Hand');
  const txt = $('insight').textContent || '';
  doc.setFont('helvetica','bold'); doc.text('Insight', 40, y); y+=12;
  doc.setFont('helvetica','normal'); 
  const split = doc.splitTextToSize(txt, 515);
  doc.text(split, 40, y);
  doc.save('PalmReport.pdf');
  setStatus('📄 PDF saved');
};

$('speak').onclick = ()=>{
  const text = ($('insight').textContent || 'No analysis yet.').replace(/\s+/g,' ').trim();
  try{
    const u = new SpeechSynthesisUtterance(text);
    u.lang = (document.getElementById('language').value || 'en');
    speechSynthesis.cancel(); speechSynthesis.speak(u);
    setStatus('🔊 Speaking…');
  }catch(e){ setStatus('Speech not supported', false); }
};

// --- Optional: SideBoot panel (no-crash if missing) ---
(async ()=>{
  const v='v=20251020a';
  try{
    const sideboot = await import(`./modules/sideboot.js?${v}`);
    await sideboot.boot?.();
    setStatus('Modules: OK');
  }catch(e){
    console.warn('SideBoot not loaded (optional):', e);
    setStatus('Modules: OK (no-sideboot)');
  }
})();
// --- Modular smoke test ---
import("./logic12.js").then(m => {
  const demo = {
    left:{density:4.43, life:"strong", head:"balanced", heart:"moderate", fate:"present", sun:"visible", health:"steady", marriage:"clear", manikanda:3},
    right:{density:5.59, life:"strong", head:"balanced", heart:"moderate", fate:"present", sun:"visible", health:"steady", marriage:"clear", manikanda:3},
    name:"Test"
  };
  const out = m.generateMiniReport(demo, "si");
  console.log("MODULE OK →", out);
  document.getElementById("insight").textContent = "MODULE OK → " + out;
}).catch(err => {
  console.error("MODULE FAIL:", err);
  document.getElementById("insight").textContent = "MODULE FAIL → " + err.message;
});

// init


setupCams();
