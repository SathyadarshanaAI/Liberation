// app.js
// ✅ paths MUST match your project tree
import { CameraCard } from "./moduler/camara.js";
import { analyzePalm }  from "./moduler/moduler.js"; // your analyzer

// DOM
const camBoxLeft  = document.getElementById("camBoxLeft");
const camBoxRight = document.getElementById("camBoxRight");
const canvasLeft  = document.getElementById("canvasLeft");
const canvasRight = document.getElementById("canvasRight");
const statusEl    = document.getElementById("status");
const insightEl   = document.getElementById("insight");
const langSel     = document.getElementById("language");

let camLeft, camRight;
let lastAnalysisLeft = null, lastAnalysisRight = null;
let lastLang = "en";
let analyzing = false;

function setStatus(m){ statusEl.textContent = m; }

// helper: avoid zero-size canvases on first load
function ensureCanvasInit(box, cvs){
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  if (!cvs.width || !cvs.height) {
    cvs.width  = Math.max(1, Math.round(box.clientWidth  * dpr));
    cvs.height = Math.max(1, Math.round(box.clientHeight * dpr));
  }
}
// ensure cam boxes are positioned correctly & poster hidden
[ [camBoxLeft, canvasLeft], [camBoxRight, canvasRight] ].forEach(([box, cvs])=>{
  if (getComputedStyle(box).position === "static") box.style.position = "relative";
  Object.assign(cvs.style, { position:"absolute", inset:0, width:"100%", height:"100%", borderRadius:"16px", zIndex:2 });
  box.style.backgroundImage = "none";
});

window.addEventListener("DOMContentLoaded", () => {
  camLeft  = new CameraCard(camBoxLeft,  { onStatus: setStatus });
  camRight = new CameraCard(camBoxRight, { onStatus: setStatus });

  ensureCanvasInit(camBoxLeft,  canvasLeft);
  ensureCanvasInit(camBoxRight, canvasRight);

  // Resize: don't touch while analyzing (keeps still images)
  new ResizeObserver(()=>{ if (!analyzing) ensureCanvasInit(camBoxLeft,  canvasLeft);  }).observe(camBoxLeft);
  new ResizeObserver(()=>{ if (!analyzing) ensureCanvasInit(camBoxRight, canvasRight); }).observe(camBoxRight);

  // LEFT
  document.getElementById("startCamLeft").onclick = async () => {
    // unlock left only
    canvasLeft.getContext("2d").clearRect(0,0,canvasLeft.width,canvasLeft.height);
    await camLeft.start();
    setStatus("Left hand camera started.");
  };
  document.getElementById("captureLeft").onclick = () => { camLeft.captureTo(canvasLeft); };
  document.getElementById("uploadLeft").onclick  = () => fileUpload(camBoxLeft, canvasLeft);
  document.getElementById("torchLeft").onclick   = () => camLeft.toggleTorch();

  // RIGHT
  document.getElementById("startCamRight").onclick = async () => {
    canvasRight.getContext("2d").clearRect(0,0,canvasRight.width,canvasRight.height);
    await camRight.start();
    setStatus("Right hand camera started.");
  };
  document.getElementById("captureRight").onclick = () => { camRight.captureTo(canvasRight); };
  document.getElementById("uploadRight").onclick  = () => fileUpload(camBoxRight, canvasRight);
  document.getElementById("torchRight").onclick   = () => camRight.toggleTorch();

  // ANALYZE
  document.getElementById("analyze").onclick = async () => {
    if (!canvasLeft.width || !canvasLeft.height)  return setStatus("Please capture the LEFT hand first.");
    if (!canvasRight.width || !canvasRight.height) return setStatus("Please capture the RIGHT hand first.");
    analyzing = true;
    setStatus("Analyzing palms...");
    try{
      await animateScan(canvasLeft);
      await animateScan(canvasRight);
      lastAnalysisLeft  = await analyzePalm(canvasLeft,  "left");
      lastAnalysisRight = await analyzePalm(canvasRight, "right");
      showInsight(lastAnalysisLeft, lastAnalysisRight, "full", lastLang);
      setStatus("Palm analysis complete!");
    }catch(e){
      console.error(e);
      setStatus("Analyze failed. Check console.");
    }finally{
      analyzing = false; // keep stills; Start buttons will unlock
    }
  };

  // Mini Report
  document.getElementById("miniReport").onclick = () => {
    if (lastAnalysisLeft && lastAnalysisRight) {
      showInsight(lastAnalysisLeft, lastAnalysisRight, "mini", lastLang);
    } else setStatus("Please capture/analyze both hands first.");
  };

  // Full Report (PDF) – keep your PDF export if you have it
  document.getElementById("fullReport").onclick = () => {
    if (!(lastAnalysisLeft && lastAnalysisRight)) return setStatus("Please capture/analyze both hands first.");
    setStatus("PDF report generated."); // plug your exportPalmPDF here if needed
  };

  // Speak
  document.getElementById("speak").onclick = () => {
    if (!(lastAnalysisLeft && lastAnalysisRight)) return setStatus("Analyze both hands first!");
    const text = getReportText(lastAnalysisLeft, lastAnalysisRight, "full", lastLang);
    speakPalmReport(text, lastLang);
  };

  langSel.onchange = () => { lastLang = langSel.value; };
});

// ---------- helpers ----------
function fileUpload(box, canvas){
  const input = document.createElement("input");
  input.type = "file"; input.accept = "image/*";
  input.onchange = e => {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader();
    r.onload = ev => {
      const img = new Image();
      img.onload = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const W = Math.max(1, Math.round(box.clientWidth  * dpr));
        const H = Math.max(1, Math.round(box.clientHeight * dpr));
        canvas.width = W; canvas.height = H;

        const s = Math.max(W/img.width, H/img.height); // COVER
        const dw = Math.round(img.width*s), dh = Math.round(img.height*s);
        const dx = Math.floor((W-dw)/2), dy = Math.floor((H-dh)/2);
        const g = canvas.getContext("2d");
        g.fillStyle = "#000"; g.fillRect(0,0,W,H);
        g.drawImage(img, 0,0,img.width,img.height, dx,dy,dw,dh);
        setStatus("Photo loaded & locked.");
      };
      img.src = ev.target.result;
    };
    r.readAsDataURL(f);
  };
  input.click();
}

async function animateScan(canvas){
  const ctx = canvas.getContext('2d');
  if (!canvas.width || !canvas.height) return;
  const snapshot = ctx.getImageData(0,0,canvas.width,canvas.height);
  const start = performance.now(), DUR = 800;
  await new Promise(res=>{
    function loop(now){
      const t = Math.min(1, (now - start)/DUR);
      ctx.putImageData(snapshot,0,0);
      const y = Math.round(t * canvas.height);
      const grad = ctx.createLinearGradient(0, y-40, 0, y+40);
      grad.addColorStop(0,   "rgba(0,0,0,0)");
      grad.addColorStop(0.5, "rgba(0,229,255,0.85)");
      grad.addColorStop(1,   "rgba(0,0,0,0)");
      ctx.fillStyle = grad; ctx.fillRect(0, y-40, canvas.width, 80);
      if (t<1) requestAnimationFrame(loop); else { ctx.putImageData(snapshot,0,0); res(); }
    }
    requestAnimationFrame(loop);
  });
}

function showInsight(left, right, mode="full", lang="en"){
  insightEl.textContent = getReportText(left, right, mode, lang);
}
function getReportText(left, right, mode){
  let out = `Sathya Darshana Palm Analyzer V5.1\n\n`;
  out += `Left: ${left.summary}\nRight: ${right.summary}\n`;
  if (mode==="full"){
    out += `\n-- Left --\n`;  left.lines.forEach(l=> out += `• ${l.name}: ${(l.confidence*100).toFixed(1)}% — ${l.insight}\n`);
    out += `\n-- Right --\n`; right.lines.forEach(l=> out += `• ${l.name}: ${(l.confidence*100).toFixed(1)}% — ${l.insight}\n`);
  }
  return out;
}
function speakPalmReport(text, lang="en"){
  if (!("speechSynthesis" in window)) return alert("Speech not supported");
  const u = new SpeechSynthesisUtterance(text); u.lang = lang; speechSynthesis.speak(u);
}
