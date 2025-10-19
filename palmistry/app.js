// >>> CHANGED: use the new universal camera
import { CameraCard } from './modules/camera.clean.js';
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

function setStatus(msg) { statusEl.textContent = msg; }

// helper: keep canvas filling the cam box
function coverCanvas(cnv){
  Object.assign(cnv.style, {
    position:'absolute', inset:0, width:'100%', height:'100%',
    borderRadius:'16px', zIndex:2
  });
}

window.addEventListener('DOMContentLoaded', () => {
  camLeft = new CameraCard(camBoxLeft,  { facingMode: 'environment', onStatus: setStatus });
  camRight = new CameraCard(camBoxRight, { facingMode: 'environment', onStatus: setStatus });

  // >>> ADDED: safer framing + ensure portrait for hi-res stills
  camLeft.setFramePad(0.90);  camLeft.setOffsetY(-0.05);  camLeft.forcePortrait  = true;
  camRight.setFramePad(0.90); camRight.setOffsetY(-0.05); camRight.forcePortrait = true;

  // Camera controls LEFT
  document.getElementById("startCamLeft").onclick = async () => {
    await camLeft.start();
    setStatus("Left hand camera started.");
  };
  // >>> CHANGED: hi-res capture (ImageCapture) with auto-portrait; was captureTo(...)
  document.getElementById("captureLeft").onclick = async () => {
    await camLeft.captureHiRes(canvasLeft);
    coverCanvas(canvasLeft);
    setStatus("Left hand captured.");
  };
  // >>> REMOVED torch (not supported in camera.clean.js). Hide button instead:
  const torchL = document.getElementById("torchLeft");
  if (torchL) torchL.style.display = "none";

  document.getElementById("uploadLeft").onclick = () => fileUpload(canvasLeft);

  // Camera controls RIGHT
  document.getElementById("startCamRight").onclick = async () => {
    await camRight.start();
    setStatus("Right hand camera started.");
  };
  // >>> CHANGED: hi-res capture (ImageCapture) with auto-portrait; was captureTo(...)
  document.getElementById("captureRight").onclick = async () => {
    await camRight.captureHiRes(canvasRight);
    coverCanvas(canvasRight);
    setStatus("Right hand captured.");
  };
  // >>> REMOVED torch + hide
  const torchR = document.getElementById("torchRight");
  if (torchR) torchR.style.display = "none";

  document.getElementById("uploadRight").onclick = () => fileUpload(canvasRight);

  // Analyze
  document.getElementById("analyze").onclick = async () => {
    setStatus("Analyzing palms...");
    await animateScan(canvasLeft);
    await animateScan(canvasRight);
    lastAnalysisLeft = await fakeAnalyze(canvasLeft, "left");
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
        leftCanvas: canvasLeft,
        rightCanvas: canvasRight,
        leftReport: lastAnalysisLeft,
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

  // Language selector
  langSel.onchange = () => { lastLang = langSel.value; };
});

// File upload handler (unchanged)
function fileUpload(canvas) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(ev) {
      const img = new Image();
      img.onload = function() {
        // Lock canvas to 3:4 aspect ratio
        let iw = img.width, ih = img.height;
        const aspect = 3/4;
        let tw = iw, th = ih;
        if (iw/ih > aspect) {
          tw = ih * aspect; th = ih;
        } else {
          tw = iw; th = iw / aspect;
        }
        canvas.width = tw;
        canvas.height = th;
        let ctx = canvas.getContext('2d');
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, tw, th);
        ctx.drawImage(img, (iw-tw)/2, (ih-th)/2, tw, th, 0, 0, tw, th);
        coverCanvas(canvas);
        setStatus("Photo loaded.");
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };
  input.click();
}

// Scan animation (unchanged)
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

// Fake palm analyzer (unchanged)
async function fakeAnalyze(canvas, hand="right") {
  const PALM_LINES = [
    { key: "heart", name: "Heart Line", insight: "Emotions, affection, compassion." },
    { key: "head", name: "Head Line", insight: "Intellect, decision-making, creativity." },
    { key: "life", name: "Life Line", insight: "Vitality, life changes, energy." },
    { key: "fate", name: "Fate Line", insight: "Career, destiny, direction." },
    { key: "success", name: "Success Line", insight: "Talent, fame, creativity." },
    { key: "health", name: "Health Line", insight: "Health, business sense, communication." },
    { key: "marriage", name: "Marriage Line", insight: "Relationships, partnership." },
    { key: "manikhanda", name: "Manikhanda (Wrist)", insight: "Fortune, stability, longevity." }
  ];
  const lines = PALM_LINES.map(l => ({
    ...l,
    confidence: Math.random()*0.4+0.6,
    details: hand==="left" ? "Reflects inherited traits, subconscious, or previous life influences." : "Shows present-life actions, choices, and conscious personality."
  }));
  return {
    hand,
    summary: hand==="left"
      ? "Previous Life Traits: Reveals subconscious patterns and inherited qualities from past lives."
      : "Current Life Traits: Reflects conscious choices, present achievements, and how you shape your destiny.",
    lines,
    tips: "Palmistry is interpreted differently in various cultures."
  };
}

// Insight/report (unchanged)
function showInsight(left, right, mode="full", lang="en") {
  insightEl.textContent = getReportText(left, right, mode, lang);
}
function getReportText(left, right, mode, lang) {
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

// Speech (unchanged)
function speakPalmReport(text, lang="en") {
  if ('speechSynthesis' in window) {
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = lang;
    window.speechSynthesis.speak(msg);
  } else {
    alert("Speech synthesis not supported on this device.");
  }
}
