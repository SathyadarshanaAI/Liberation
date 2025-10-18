import { CameraCard } from './modules/camera.js';
import { exportPalmPDF } from './modules/pdf.js';

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

// NEW: lock state per hand (no visual change; just logic)
let lockedL = false, lockedR = false;

function setStatus(msg){ statusEl.textContent = msg; }

// keep canvas size unless unlocked (prevents “captured image” from being cleared)
function fitCanvasIfUnlocked(box, canvas, locked){
  if (locked) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width  = Math.round(box.clientWidth  * dpr);
  canvas.height = Math.round(box.clientHeight * dpr);
}

function lockCanvas(box, canvas, hand){
  if (hand==='L') lockedL = true; else lockedR = true;
  // nothing else needed; poster hide & freeze already handled inside cam.captureTo()
}
function unlockCanvas(box, canvas, hand){
  if (hand==='L') lockedL = false; else lockedR = false;
  const g = canvas.getContext('2d');
  g.clearRect(0,0,canvas.width,canvas.height);
  fitCanvasIfUnlocked(box, canvas, false);
}

window.addEventListener('DOMContentLoaded', () => {
  camLeft  = new CameraCard(camBoxLeft,  { facingMode: 'environment', onStatus: setStatus });
  camRight = new CameraCard(camBoxRight, { facingMode: 'environment', onStatus: setStatus });

  // LEFT
  document.getElementById("startCamLeft").onclick = async () => {
    unlockCanvas(camBoxLeft, canvasLeft, 'L');
    await camLeft.start();
    setStatus("Left hand camera started.");
  };
  document.getElementById("captureLeft").onclick = () => {
    if (camLeft.captureTo(canvasLeft)) {
      lockCanvas(camBoxLeft, canvasLeft, 'L');
      setStatus("Left hand captured.");
    }
  };
  document.getElementById("torchLeft").onclick = async () => { await camLeft.toggleTorch(); };
  document.getElementById("uploadLeft").onclick = () => fileUpload(camBoxLeft, canvasLeft, 'L');

  // RIGHT
  document.getElementById("startCamRight").onclick = async () => {
    unlockCanvas(camBoxRight, canvasRight, 'R');
    await camRight.start();
    setStatus("Right hand camera started.");
  };
  document.getElementById("captureRight").onclick = () => {
    if (camRight.captureTo(canvasRight)) {
      lockCanvas(camBoxRight, canvasRight, 'R');
      setStatus("Right hand captured.");
    }
  };
  document.getElementById("torchRight").onclick = async () => { await camRight.toggleTorch(); };
  document.getElementById("uploadRight").onclick = () => fileUpload(camBoxRight, canvasRight, 'R');

  // Analyze
  document.getElementById("analyze").onclick = async () => {
    // guard: need at least one image each
    if (!canvasLeft.width || !canvasRight.width){
      setStatus("Please capture/upload both hands first."); return;
    }
    setStatus("Analyzing palms...");
    await animateScan(canvasLeft);
    await animateScan(canvasRight);
    lastAnalysisLeft  = await fakeAnalyze(canvasLeft,  "left");
    lastAnalysisRight = await fakeAnalyze(canvasRight, "right");
    showInsight(lastAnalysisLeft, lastAnalysisRight, "full", lastLang);
    setStatus("Palm analysis complete!");
  };

  // Mini Report
  document.getElementById("miniReport").onclick = () => {
    if (lastAnalysisLeft && lastAnalysisRight) {
      showInsight(lastAnalysisLeft, lastAnalysisRight, "mini", lastLang);
    } else {
      setStatus("Please capture/analyze both hands first.");
    }
  };

  // Full Report (PDF)
  document.getElementById("fullReport").onclick = () => {
    if (lastAnalysisLeft && lastAnalysisRight) {
      exportPalmPDF({
        leftCanvas:  canvasLeft,
        rightCanvas: canvasRight,
        leftReport:  lastAnalysisLeft,
        rightReport: lastAnalysisRight,
        mode: "full"
      });
      setStatus("PDF report generated.");
    } else {
      setStatus("Please capture/analyze both hands first.");
    }
  };

  // Speak
  document.getElementById("speak").onclick = () => {
    if (lastAnalysisLeft && lastAnalysisRight) {
      const text = getReportText(lastAnalysisLeft, lastAnalysisRight, "full", lastLang);
      speakPalmReport(text, lastLang);
    } else {
      setStatus("Analyze both hands first!");
    }
  };

  // Language
  langSel.onchange = () => { lastLang = langSel.value; };

  // initial canvas fit (unlocked)
  fitCanvasIfUnlocked(camBoxLeft,  canvasLeft,  lockedL);
  fitCanvasIfUnlocked(camBoxRight, canvasRight, lockedR);
  new ResizeObserver(()=>fitCanvasIfUnlocked(camBoxLeft, canvasLeft, lockedL)).observe(camBoxLeft);
  new ResizeObserver(()=>fitCanvasIfUnlocked(camBoxRight, canvasRight, lockedR)).observe(camBoxRight);
});

// File upload handler (locks after draw)
function fileUpload(box, canvas, hand){
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(ev){
      const img = new Image();
      img.onload = function(){
        let iw = img.width, ih = img.height;
        const aspect = 3/4;
        let tw = iw, th = ih;
        if (iw/ih > aspect) { tw = ih * aspect; th = ih; }
        else { tw = iw; th = iw / aspect; }

        const dpr = Math.min(window.devicePixelRatio||1,2);
        canvas.width  = Math.round(tw * dpr);
        canvas.height = Math.round(th * dpr);

        const ctx = canvas.getContext('2d');
        ctx.fillStyle = "#fff";
        ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.drawImage(img, Math.round((iw-tw)/2), Math.round((ih-th)/2), Math.round(tw), Math.round(th), 0,0, canvas.width, canvas.height);

        lockCanvas(box, canvas, hand);
        setStatus("Photo loaded.");
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };
  input.click();
}

// (animateScan, drawScanBeam, fakeAnalyze, showInsight, getReportText, speakPalmReport)
// — keep as in your file —
