import { CameraCard } from './modules/camera.js';
import { exportPalmPDF } from './modules/pdf.js';

const camBoxLeft = document.getElementById("camBoxLeft");
const camBoxRight = document.getElementById("camBoxRight");
const canvasLeft = document.getElementById("canvasLeft");
const canvasRight = document.getElementById("canvasRight");
const statusEl = document.getElementById("status");
const insightEl = document.getElementById("insight");
const langSel = document.getElementById("language");

let camLeft, camRight;
let lastAnalysisLeft = null, lastAnalysisRight = null;
let lastLang = "en";

const SUPPORTED_LANGS = ['en','si','ta','hi','bn','ar','es','fr','de','ru','ja','zh-CN'];
const TTS_LANG_MAP = {
  'en':'en-US','si':'si-LK','ta':'ta-IN','hi':'hi-IN','bn':'bn-IN','ar':'ar-SA',
  'es':'es-ES','fr':'fr-FR','de':'de-DE','ru':'ru-RU','ja':'ja-JP','zh-CN':'zh-CN'
};

function setStatus(msg){ statusEl.textContent = msg; }

window.addEventListener('DOMContentLoaded', () => {
  camLeft = new CameraCard(camBoxLeft,{ facingMode:'environment',onStatus:setStatus });
  camRight = new CameraCard(camBoxRight,{ facingMode:'environment',onStatus:setStatus });

  // Camera Controls
  document.getElementById("startCamLeft").onclick=async()=>{await camLeft.start();setStatus("Left started.");};
  document.getElementById("captureLeft").onclick=()=>{camLeft.captureTo(canvasLeft);setStatus("Left captured.");};
  document.getElementById("torchLeft").onclick=async()=>{await camLeft.toggleTorch();};
  document.getElementById("uploadLeft").onclick=()=>fileUpload(canvasLeft);

  document.getElementById("startCamRight").onclick=async()=>{await camRight.start();setStatus("Right started.");};
  document.getElementById("captureRight").onclick=()=>{camRight.captureTo(canvasRight);setStatus("Right captured.");};
  document.getElementById("torchRight").onclick=async()=>{await camRight.toggleTorch();};
  document.getElementById("uploadRight").onclick=()=>fileUpload(canvasRight);

  // Analyze
  document.getElementById("analyze").onclick = async()=>{
    setStatus("Analyzing...");
    await animateScan(canvasLeft);await animateScan(canvasRight);
    lastAnalysisLeft = await fakeAnalyze(canvasLeft,"left");
    lastAnalysisRight = await fakeAnalyze(canvasRight,"right");
    showInsight(lastAnalysisLeft,lastAnalysisRight,"full",lastLang);
    setStatus("Done!");
  };

  // Mini Report
  document.getElementById("miniReport").onclick=()=>{
    if(lastAnalysisLeft&&lastAnalysisRight)showInsight(lastAnalysisLeft,lastAnalysisRight,"mini",lastLang);
  };

  // Full Report (PDF)
  document.getElementById("fullReport").onclick=()=>{
    if(lastAnalysisLeft&&lastAnalysisRight){
      const text=getReportText(lastAnalysisLeft,lastAnalysisRight,"full",lastLang);
      exportPalmPDF({ leftCanvas:canvasLeft,rightCanvas:canvasRight,reportText:text });
      setStatus("PDF Saved.");
    }else setStatus("Capture both hands first.");
  };

  // Speak
  document.getElementById("speak").onclick=()=>{
    if(lastAnalysisLeft&&lastAnalysisRight){
      const text=getReportText(lastAnalysisLeft,lastAnalysisRight,"full",lastLang);
      speakPalmReport(text,lastLang);
    }
  };

  // Language Change
  langSel.onchange=()=>{ lastLang=SUPPORTED_LANGS.includes(langSel.value)?langSel.value:'en'; };
});

// ==== Helper Functions ====
function fileUpload(canvas){
  const input=document.createElement("input");
  input.type="file";input.accept="image/*";
  input.onchange=e=>{
    const file=e.target.files[0];if(!file)return;
    const reader=new FileReader();
    reader.onload=ev=>{
      const img=new Image();
      img.onload=()=>{
        const iw=img.width,ih=img.height,aspect=3/4;
        let tw=iw,th=ih;
        if(iw/ih>aspect){tw=ih*aspect;th=ih;}else{tw=iw;th=iw/aspect;}
        canvas.width=tw;canvas.height=th;
        const ctx=canvas.getContext('2d');
        ctx.fillStyle="#fff";ctx.fillRect(0,0,tw,th);
        ctx.drawImage(img,(iw-tw)/2,(ih-th)/2,tw,th,0,0,tw,th);
        setStatus("Photo loaded.");
      };
      img.src=ev.target.result;
    };
    reader.readAsDataURL(file);
  };
  input.click();
}

async function animateScan(canvas){
  const ctx=canvas.getContext('2d');
  const frame=ctx.getImageData(0,0,canvas.width,canvas.height);
  const start=performance.now(),dur=800;
  await new Promise(res=>{
    function loop(now){
      const t=Math.min(1,(now-start)/dur);
      ctx.putImageData(frame,0,0);
      const y=t*canvas.height;
      const g=ctx.createLinearGradient(0,y-40,0,y+40);
      g.addColorStop(0,"rgba(0,229,255,0)");
      g.addColorStop(.5,"rgba(0,229,255,0.85)");
      g.addColorStop(1,"rgba(0,229,255,0)");
      ctx.fillStyle=g;ctx.fillRect(0,y-40,canvas.width,80);
      if(t<1)requestAnimationFrame(loop);else res();
    }requestAnimationFrame(loop);
  });
}

async function fakeAnalyze(canvas,hand){
  const lines=["Heart","Head","Life","Fate","Health","Marriage"];
  return { hand, summary: hand==="left"?"Inherited tendencies":"Present actions",
    lines:lines.map(n=>({name:n,confidence:Math.random()*0.4+0.6,insight:`${n} insight`})) };
}

function showInsight(L,R,mode,lang){ insightEl.textContent=getReportText(L,R,mode,lang); }

function getReportText(L,R,mode,lang){
  let out=`Sathya Darshana Palm Analyzer V5.2\n\n`;
  out+=`Left: ${L.summary}\nRight: ${R.summary}\n\n`;
  L.lines.forEach(l=>out+=`• ${l.name}: ${(l.confidence*100).toFixed(1)}%\n`);
  R.lines.forEach(l=>out+=`• ${l.name}: ${(l.confidence*100).toFixed(1)}%\n`);
  return out;
}

function speakPalmReport(text,lang='en'){
  if(!('speechSynthesis'in window))return;
  const msg=new SpeechSynthesisUtterance(text);
  const code=TTS_LANG_MAP[lang]||'en-US';msg.lang=code;
  const v=window.speechSynthesis.getVoices().find(v=>v.lang===code);
  if(v)msg.voice=v;
  window.speechSynthesis.speak(msg);
}
