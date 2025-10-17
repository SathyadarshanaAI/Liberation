// Sathyadarshana Quantum Palm Analyzer V5.1
import { CameraCard } from './modules/camera.js';
import { analyzePalm } from './modules/analyzer.js';
import { exportPalmPDF, LANGUAGES } from './modules/pdf.js';

const $ = (s, r=document) => r.querySelector(s);
const statusEl = $("#status");
const canvasLeft = $("#canvasLeft");
const canvasRight = $("#canvasRight");
const camBoxLeft = $("#camBoxLeft");
const camBoxRight = $("#camBoxRight");
const btnStartCamLeft = $("#startCamLeft");
const btnStartCamRight = $("#startCamRight");
const btnSwitch = $("#switchCam");
const btnTorch = $("#toggleTorch");
const btnCaptureLeft = $("#captureLeft");
const btnCaptureRight = $("#captureRight");
const btnUploadLeft = $("#uploadLeft");
const btnUploadRight = $("#uploadRight");
const btnAnalyze = $("#analyze");
const btnMiniReport = $("#miniReport");
const btnFullReport = $("#fullReport");
const btnSpeak = $("#speak");
const insightEl = $("#insight");
const langSel = $("#language");

let cameraLeft = null, cameraRight = null;
let lastAnalysisLeft = null, lastAnalysisRight = null;
let lastHand = "right";
let lastLang = "en";

function setStatus(msg) { statusEl.textContent = msg; }

window.addEventListener('DOMContentLoaded', () => {
  cameraLeft = new CameraCard(camBoxLeft, { facingMode: 'environment', onStatus: setStatus });
  cameraRight = new CameraCard(camBoxRight, { facingMode: 'environment', onStatus: setStatus });

  btnStartCamLeft.onclick = async () => { await cameraLeft.start(); setStatus("Left hand camera started."); };
  btnStartCamRight.onclick = async () => { await cameraRight.start(); setStatus("Right hand camera started."); };

  btnSwitch.onclick = async () => {
    lastHand = lastHand === "right" ? "left" : "right";
    if (lastHand === "right") await cameraRight.switch();
    else await cameraLeft.switch();
    setStatus(`Switched to ${lastHand} hand.`);
  };

  btnTorch.onclick = async () => {
    if (lastHand === "right") await cameraRight.toggleTorch();
    else await cameraLeft.toggleTorch();
  };

  btnCaptureLeft.onclick = () => {
    cameraLeft.captureTo(canvasLeft);
    setStatus("Left hand captured.");
  };

  btnCaptureRight.onclick = () => {
    cameraRight.captureTo(canvasRight);
    setStatus("Right hand captured.");
  };

  btnUploadLeft.onclick = () => fileUpload(canvasLeft);
  btnUploadRight.onclick = () => fileUpload(canvasRight);

  function fileUpload(canvas) {
    const input = document.createElement("input");
    input.type = "file"; input.accept = "image/*";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function(ev) {
        const img = new Image();
        img.onload = function() {
          canvas.width = img.width; canvas.height = img.height;
          canvas.getContext('2d').drawImage(img, 0, 0);
          setStatus("Photo loaded.");
        };
        img.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    };
    input.click();
  }

  btnAnalyze.onclick = async () => {
    setStatus("Analyzing palms...");
    await animateScan(canvasLeft);
    await animateScan(canvasRight);

    lastAnalysisLeft = await analyzePalm(canvasLeft, "left");
    lastAnalysisRight = await analyzePalm(canvasRight, "right");
    showInsight(lastAnalysisLeft, lastAnalysisRight, "full", lastLang);
    setStatus("Analysis complete!");
  };

  btnMiniReport.onclick = () => {
    if (lastAnalysisLeft && lastAnalysisRight) showInsight(lastAnalysisLeft, lastAnalysisRight, "mini", lastLang);
    else setStatus("No analysis yet.");
  };

  btnFullReport.onclick = () => {
    if (lastAnalysisLeft && lastAnalysisRight) {
      exportPalmPDF({
        leftCanvas: canvasLeft,
        rightCanvas: canvasRight,
        leftReport: lastAnalysisLeft,
        rightReport: lastAnalysisRight,
        mode: "full"
      });
      setStatus("PDF downloaded.");
    } else setStatus("No analysis yet.");
  };

  btnSpeak.onclick = () => {
    if (lastAnalysisLeft && lastAnalysisRight) {
      const text = getReportText(lastAnalysisLeft, lastAnalysisRight, "full", lastLang);
      speakPalmReport(text, lastLang);
    }
  };

  langSel.onchange = () => { lastLang = langSel.value; };

});

// Scan Beam Animation (visual feedback)
async function animateScan(canvas) {
  const ctx = canvas.getContext('2d');
  const start = performance.now(), dur = 800;
  const frame = ctx.getImageData(0,0,canvas.width,canvas.height);
  await new Promise(res => {
    function loop(now) {
      const t = Math.min(1, (now - start) / dur);
      ctx.putImageData(frame,0,0);
      drawScanBeam(ctx, canvas.width, canvas.height, t);
      if (t < 1) requestAnimationFrame(loop); else res();
    }
    requestAnimationFrame(loop);
  });
}
function drawScanBeam(ctx, w, h, progress) {
  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,0.15)";
  ctx.fillRect(0,0,w,h);
  const y = progress * h;
  const g = ctx.createLinearGradient(0, y-40, 0, y+40);
  g.addColorStop(0,"rgba(0,229,255,0)");
  g.addColorStop(.5,"rgba(0,229,255,0.85)");
  g.addColorStop(1,"rgba(0,229,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, y-40, w, 80);
  ctx.restore();
}

// Speech Synthesis (AI speech-friendly)
function speakPalmReport(text, lang="en") {
  if ('speechSynthesis' in window) {
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = lang;
    window.speechSynthesis.speak(msg);
  } else {
    alert("Speech synthesis not supported on this device.");
  }
}

// Show Insight (multi-language ready, full/mini)
function showInsight(left, right, mode="full", lang="en") {
  insightEl.textContent = getReportText(left, right, mode, lang);
}

// Report generator (multi-language stub)
function getReportText(left, right, mode, lang) {
  // For demo, only English; can be extended with multi-language objects
  let out = `Sathya Darshana Palm Analyzer V5.1\n\nemail: sathyadarshana2025@gmail.com\nphone: +94757500000\nSri Lanka\n\n`;
  out += `Left Hand: ${left.hand === "left" ? "Previous Life Traits" : ""}\n${left.summary}\n\n`;
  out += `Right Hand: ${right.hand === "right" ? "Current Life Traits" : ""}\n${right.summary}\n\n`;
  if (mode === "full") {
    out += "------ Left Hand Detailed ------\n";
    left.lines.forEach(l => { out += `• ${l.name}: ${l.insight} (${(l.confidence*100).toFixed(1)}%)\n`; });
    out += "\n------ Right Hand Detailed ------\n";
    right.lines.forEach(l => { out += `• ${l.name}: ${l.insight} (${(l.confidence*100).toFixed(1)}%)\n`; });
  } else {
    out += "Mini Report (Most prominent lines):\n";
    const topLeft = left.lines.reduce((max, l) => l.confidence > max.confidence ? l : max, left.lines[0]);
    const topRight = right.lines.reduce((max, l) => l.confidence > max.confidence ? l : max, right.lines[0]);
    out += `Left: ${topLeft.name} (${(topLeft.confidence*100).toFixed(1)}%) - ${topLeft.insight}\n`;
    out += `Right: ${topRight.name} (${(topRight.confidence*100).toFixed(1)}%) - ${topRight.insight}\n`;
  }
  out += "\nPalmistry interpreted differently in various cultures.\n";
  return out;
}
