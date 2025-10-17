// Sathyadarshana Quantum Palm Analyzer V5.1 - app.js
import { CameraCard } from './modules/camera.js';
// import { exportPDF } from './modules/pdf.js'; // PDF support future-ready

const $ = (s, r=document) => r.querySelector(s);

// UI Elements
const statusEl = $("#status");
const canvas = $("#canvas");
const camBox = $("#camBox");
const btnStart = $("#startCam");
const btnSwitch = $("#switchCam");
const btnTorch = $("#toggleTorch");
const btnCapture = $("#capture");
const btnUpload = $("#filePick");
const btnAnalyze = $("#analyze");
const btnFullReport = $("#dlPdf");
const btnMiniReport = document.createElement("button");
btnMiniReport.className = "btn";
btnMiniReport.textContent = "Mini Report";
btnFullReport.textContent = "Full Report";
const insightEl = $("#insight");

// Remove 7 lines analyzer area if present
const linesArea = $(".lines");
if (linesArea) linesArea.style.display = "none"; // Hide the 7 lines bar

// Add Mini Report button next to Full Report
btnFullReport.parentNode.insertBefore(btnMiniReport, btnFullReport);

// Analyzer protected area: just reserve the space
const analyzerCard = insightEl.parentElement;
analyzerCard.style.minHeight = "220px"; // Reserve area for analysis output

// Palmistry logic
const palmLineInfo = [
  {
    key: "heart",
    name: "Heart Line",
    insight: "Emotions, affection, compassion. Deep line: warm-hearted; wavy: sensitive.",
  },
  {
    key: "head",
    name: "Head Line",
    insight: "Intellect, decision-making, creativity. Straight: logical; curved: imaginative.",
  },
  {
    key: "life",
    name: "Life Line",
    insight: "Vitality, life changes, energy. Long: robust health; faint: caution.",
  },
  {
    key: "fate",
    name: "Fate Line",
    insight: "Career, destiny, direction. Deep: strong purpose; breaks: changes.",
  },
  {
    key: "success",
    name: "Success (Apollo) Line",
    insight: "Talent, fame, creativity. Clear: recognition; weak: modesty.",
  },
  {
    key: "health",
    name: "Health (Mercury) Line",
    insight: "Health, business sense, communication. Defined: good skills.",
  },
  {
    key: "marriage",
    name: "Marriage Line",
    insight: "Relationships, partnership. Deep: lasting bond; multiple: complexity.",
  },
  {
    key: "manikhanda",
    name: "Manikhanda (Wrist/Bangle) Line",
    insight: "Fortune, stability, longevity. Clear: good fortune; chained: challenges.",
  },
];

// Personality descriptions
const handPersonality = {
  left: "Previous Life Traits: Reveals subconscious patterns and inherited qualities from past lives.",
  right: "Current Life Traits: Reflects conscious choices, present achievements, and destiny shaping."
};

// App state
let camera = null;
let lastHand = "right"; // default
let lastAnalysis = null;

// Helpers
function setStatus(msg) { statusEl.textContent = msg; }
function showInsight(report, mode="full") {
  let out = `Sathyadarshana Quantum Palm Analyzer V5.1\n\n`;
  out += `Hand: ${report.hand === "left" ? "Left" : "Right"}\n`;
  out += (report.hand === "left" ? handPersonality.left : handPersonality.right) + "\n\n";
  if (mode === "full") {
    out += "Palm Lines:\n";
    report.lines.forEach((line, i) => {
      const info = palmLineInfo.find(p => p.key === line.type);
      out += `• ${info ? info.name : line.type}: ${info ? info.insight : line.info}\n  Confidence: ${(line.confidence*100).toFixed(1)}%\n`;
    });
    out += "\nTips: Palmistry is interpreted differently in various cultures.\n";
  } else {
    out += "Mini Report:\n";
    const topLine = report.lines.reduce((max, line) => line.confidence > max.confidence ? line : max, report.lines[0]);
    const info = palmLineInfo.find(p => p.key === topLine.type);
    out += `Most prominent line: ${info ? info.name : topLine.type}\n`;
    out += `• Insight: ${info ? info.insight : topLine.info}\n`;
    out += `• Confidence: ${(topLine.confidence*100).toFixed(1)}%\n`;
  }
  insightEl.textContent = out;
}

// Camera + Analyzer logic
window.addEventListener('DOMContentLoaded', () => {
  camera = new CameraCard(camBox, {
    facingMode: 'environment',
    onStatus: setStatus
  });

  // Start camera
  btnStart.onclick = async () => {
    await camera.start();
    setStatus('Camera started');
  };

  // Switch hand/camera
  btnSwitch.onclick = async () => {
    lastHand = (lastHand === "right") ? "left" : "right";
    await camera.switch();
    setStatus(`Switched to ${lastHand === "right" ? "Right" : "Left"} hand`);
  };

  // Torch
  btnTorch.onclick = async () => { await camera.toggleTorch(); };

  // Capture
  btnCapture.onclick = () => {
    camera.captureTo(canvas);
    setStatus('Image captured – now you can analyze.');
  };

  // Upload photo
  btnUpload.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(ev) {
      const img = new Image();
      img.onload = function() {
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext('2d').drawImage(img, 0, 0);
        setStatus('Photo loaded – now you can analyze.');
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Analyze (with scan beam animation)
  btnAnalyze.onclick = async () => {
    setStatus('Analyzing palm...');
    await animateScan(canvas);
    // Simulate analysis (future: call analyzer module/AI/worker)
    lastAnalysis = {
      hand: lastHand,
      lines: palmLineInfo.map(line => ({
        type: line.key,
        confidence: Math.random()*0.5 + 0.5, // random 50-100%
        info: line.insight
      })),
      tips: "Palmistry is interpreted differently in various cultures."
    };
    showInsight(lastAnalysis, "full");
    setStatus('Analysis complete!');
  };

  // Mini Report
  btnMiniReport.onclick = () => {
    if (lastAnalysis) showInsight(lastAnalysis, "mini");
    else setStatus("No analysis available.");
  };

  // Full Report
  btnFullReport.onclick = () => {
    if (lastAnalysis) showInsight(lastAnalysis, "full");
    else setStatus("No analysis available.");
    // Future: exportPDF(canvas, lastAnalysis);
  };
});

// Scan Beam Animation
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
