// app.js

// Camera & Analyze imports
import { CameraCard } from './moduler/camara.js';
import { analyzePalm }  from './moduler/moduler.js'; // adjust path if your file lives elsewhere
// (PDF module optional)
// import { exportPalmPDF } from './modules/pdf.js';

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

// lock flags + analyzing flag
let lockedL = false, lockedR = false, analyzing = false;

function setStatus(msg){ statusEl.textContent = msg; }

// initial fit (avoid zero-size canvases)
function fit(box, cvs){
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  if (!cvs.width || !cvs.height) {
    cvs.width  = Math.max(1, Math.round(box.clientWidth  * dpr));
    cvs.height = Math.max(1, Math.round(box.clientHeight * dpr));
  }
}

window.addEventListener('DOMContentLoaded', () => {
  camLeft  = new CameraCard(camBoxLeft,  { facingMode: 'environment', onStatus: setStatus });
  camRight = new CameraCard(camBoxRight, { facingMode: 'environment', onStatus: setStatus });

  fit(camBoxLeft,  canvasLeft);
  fit(camBoxRight, canvasRight);

  // Prevent resize from clearing locked/analyzing canvases
  new ResizeObserver(()=>{ if (!lockedL && !analyzing) fit(camBoxLeft,  canvasLeft);  }).observe(camBoxLeft);
  new ResizeObserver(()=>{ if (!lockedR && !analyzing) fit(camBoxRight, canvasRight); }).observe(camBoxRight);

  // LEFT controls
  document.getElementById("startCamLeft").onclick = async () => {
    lockedL = false;
    canvasLeft.getContext('2d').clearRect(0,0,canvasLeft.width,canvasLeft.height);
    await camLeft.start();
    setStatus("Left hand camera started.");
  };
  document.getElementById("captureLeft").onclick = () => {
    if (camLeft.captureTo(canvasLeft)) {
      lockedL = true;
      setStatus("Left hand captured & locked.");
    }
  };
  document.getElementById("uploadLeft").onclick = () => fileUpload(camBoxLeft, canvasLeft, 'L');
  document.getElementById("torchLeft").onclick  = () => camLeft.toggleTorch();

  // RIGHT controls
  document.getElementById("startCamRight").onclick = async () => {
    lockedR = false;
    canvasRight.getContext('2d').clearRect(0,0,canvasRight.width,canvasRight.height);
    await camRight.start();
    setStatus("Right hand camera started.");
  };
  document.getElementById("captureRight").onclick = () => {
    if (camRight.captureTo(canvasRight)) {
      lockedR = true;
      setStatus("Right hand captured & locked.");
    }
  };
  document.getElementById("uploadRight").onclick = () => fileUpload(camBoxRight, canvasRight, 'R');
  document.getElementById("torchRight").onclick  = () => camRight.toggleTorch();

  // ANALYZE (keep both stills on screen until finished)
  document.getElementById("analyze").onclick = async () => {
    if (!canvasLeft.width || !canvasLeft.height)  { setStatus("Please capture the LEFT hand first.");  return; }
    if (!canvasRight.width || !canvasRight.height){ setStatus("Please capture the RIGHT hand first."); return; }

    analyzing = true;
    setStatus("Analyzing palms...");
    try {
      await animateScan(canvasLeft);
      await animateScan(canvasRight);

      lastAnalysisLeft  = await analyzePalm(canvasLeft,  "left");
      lastAnalysisRight = await analyzePalm(canvasRight, "right");

      showInsight(lastAnalysisLeft, lastAnalysisRight, "full", lastLang);
      setStatus("Palm analysis complete!");
    } catch (e) {
      console.error(e);
      setStatus("Analyze failed. Check console.");
    } finally {
      analyzing = false; // keep images locked; only Start buttons unlock
    }
  };

  // Mini Report (optional, keep your existing)
  document.getElementById("miniReport").onclick = () => {
    if (lastAnalysisLeft && lastAnalysisRight) {
      showInsight(lastAnalysisLeft, lastAnalysisRight, "mini", lastLang);
    } else setStatus("Please capture/analyze both hands first.");
  };

  // Full Report (PDF) – if you use exportPalmPDF
  document.getElementById("fullReport").onclick = () => {
    if (!(lastAnalysisLeft && lastAnalysisRight)) return setStatus("Please capture/analyze both hands first.");
    // exportPalmPDF && exportPalmPDF({ leftCanvas: canvasLeft, rightCanvas: canvasRight, leftReport: lastAnalysisLeft, rightReport: lastAnalysisRight, mode: "full" });
    setStatus("PDF report generated.");
  };

  // Speak
  document.getElementById("speak").onclick = () => {
    if (!(lastAnalysisLeft && lastAnalysisRight)) return setStatus("Analyze both hands first!");
    const text = getReportText(lastAnalysisLeft, lastAnalysisRight, "full", lastLang);
    speakPalmReport(text, lastLang);
  };

  langSel.onchange = () => { lastLang = langSel.value; };
});

// Upload → full-fit draw + lock
function fileUpload(box, canvas, hand){
  const input = document.createElement("input");
  input.type = "file"; input.accept = "image/*";
  input.onchange = e => {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader();
    r.onload = ev => {
      const img = new Image();
      img.onload = () => {
        const dpr = Math.min(window.devicePixelRatio||1,2);
        const W = Math.max(1, Math.round(box.clientWidth  * dpr));
        const H = Math.max(1, Math.round(box.clientHeight * dpr));
        canvas.width = W; canvas.height = H;

        const s = Math.min(W/img.width, H/img.height); // contain
        const dw = Math.round(img.width * s), dh = Math.round(img.height * s);
        const dx = Math.floor((W - dw)/2), dy = Math.floor((H - dh)/2);

        const g = canvas.getContext('2d');
        g.fillStyle = '#000'; g.fillRect(0,0,W,H);
        g.drawImage(img, 0,0, img.width,img.height, dx,dy,dw,dh);

        if (hand === 'L') lockedL = true; else lockedR = true;
        setStatus("Photo loaded & locked.");
      };
      img.src = ev.target.result;
    };
    r.readAsDataURL(f);
  };
  input.click();
}

// Scan animation (overlay only; restore still after)
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
      ctx.fillStyle = grad;
      ctx.fillRect(0, y-40, canvas.width, 80);
      if (t<1) requestAnimationFrame(loop); else { ctx.putImageData(snapshot,0,0); res(); }
    }
    requestAnimationFrame(loop);
  });
}

// ------- Your existing reporting helpers (unchanged UI) -------
function showInsight(left, right, mode="full", lang="en"){
  insightEl.textContent = getReportText(left, right, mode, lang);
}
function getReportText(left, right, mode, lang){
  let out = `Sathya Darshana Palm Analyzer V5.1\n\n`;
  out += `Left: ${left.summary}\nRight: ${right.summary}\n`;
  if (mode === "full"){
    out += `\n-- Left --\n`;  left.lines.forEach(l=> out += `• ${l.name}: ${(l.confidence*100).toFixed(1)}% — ${l.insight}\n`);
    out += `\n-- Right --\n`; right.lines.forEach(l=> out += `• ${l.name}: ${(l.confidence*100).toFixed(1)}% — ${l.insight}\n`);
  } else {
    const tl = left.lines.reduce((a,b)=>a.confidence>b.confidence?a:b);
    const tr = right.lines.reduce((a,b)=>a.confidence>b.confidence?a:b);
    out += `\nMini Report:\nLeft: ${tl.name} ${(tl.confidence*100).toFixed(1)}% — ${tl.insight}\n`;
    out += `Right: ${tr.name} ${(tr.confidence*100).toFixed(1)}% — ${tr.insight}\n`;
  }
  return out;
}
function speakPalmReport(text, lang="en"){
  if (!('speechSynthesis' in window)) return alert('Speech not supported');
  const u = new SpeechSynthesisUtterance(text); u.lang = lang; speechSynthesis.speak(u);
}
