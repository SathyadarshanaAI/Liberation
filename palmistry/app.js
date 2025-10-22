import { CameraCard } from './modules/camera.js';
import { emit } from './modules/bus.js';
import { verifyPalmTruth } from './modules/truthGuard.js';
import { generatePalmReport } from './modules/report.js';

const $ = id => document.getElementById(id);
const statusEl = $('status');
const leftCv = $('canvasLeft');
const rightCv = $('canvasRight');

function setStatus(msg, ok=true){
  statusEl.textContent = msg;
  statusEl.style.color = ok ? '#16f0a7' : '#ff6b6b';
  emit('analyzer:status',{msg,ok});
}

// setup cameras
let camLeft, camRight;
function setupCams(){
  camLeft  = new CameraCard($('camBoxLeft'), { facingMode:'environment', onStatus:setStatus });
  camRight = new CameraCard($('camBoxRight'), { facingMode:'environment', onStatus:setStatus });

  $('startCamLeft').onclick  = ()=> camLeft.start();
  $('startCamRight').onclick = ()=> camRight.start();
  $('captureLeft').onclick   = ()=> camLeft.captureTo(leftCv,{mirror:false});
  $('captureRight').onclick  = ()=> camRight.captureTo(rightCv,{mirror:true});
}

function analyzeCanvas(cv){
  const ctx=cv.getContext('2d');const {width:w,height:h}=cv;
  if(!w||!h)return{ok:false,msg:'No image'};
  const img=ctx.getImageData(0,0,w,h).data;
  let sum=0;
  for(let i=0;i<img.length;i+=4){
    const v=(img[i]*0.3+img[i+1]*0.59+img[i+2]*0.11);
    sum+=(v<90?1:0);
  }
  const density=(sum/(w*h))*100;
  return{ok:true,metrics:{density:+density.toFixed(2)},report:`Line density ${density.toFixed(2)}%`};
}

$('analyze').onclick = async()=>{
  setStatus("🪷 Analyzing... please wait");
  const truth = await verifyPalmTruth(leftCv);
  if(!truth.ok){
    setStatus(truth.msg,false);
    $('insight').innerHTML="<b>🛡️ Truth Guard Activated – Report Denied.</b>";
    return;
  }

  const L = analyzeCanvas(leftCv);
  const R = analyzeCanvas(rightCv);
  const mini = generatePalmReport({hand:'Left',density:L.metrics?.density},'mini');
  const deep = generatePalmReport({hand:'Right',density:R.metrics?.density},'deep');
  $('insight').innerHTML = `${mini}<hr>${deep}`;
  setStatus("✅ Analysis complete (V6.0 Final)");
};

$('fullReport').onclick = ()=>{
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit:'pt', format:'a4' });
  doc.text("Sathyadarshana Quantum Palm Analyzer V6.0 Final", 40, 50);
  doc.text($('insight').innerText || "", 40, 80, { maxWidth:520 });
  doc.save("PalmReport_V6_Final.pdf");
  setStatus("📄 PDF saved");
};

$('speak').onclick = ()=>{
  const txt = $('insight').innerText || "No analysis yet.";
  const u = new SpeechSynthesisUtterance(txt);
  u.lang = 'en';
  speechSynthesis.speak(u);
  setStatus("🔊 Speaking...");
};

setupCams();
setStatus("🌿 Ready – Truth Guard Active");
