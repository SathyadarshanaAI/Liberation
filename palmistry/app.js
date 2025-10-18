import { CameraCard } from './modules/camara.js';

// Element refs
const camBoxLeft = document.getElementById("camBoxLeft");
const camBoxRight = document.getElementById("camBoxRight");
const canvasLeft = document.getElementById("canvasLeft");
const canvasRight = document.getElementById("canvasRight");
const statusEl = document.getElementById("status");
const insightEl = document.getElementById("insight");

// CameraCard instances
let camLeft, camRight;
let leftPalmAI = null, rightPalmAI = null;

function setStatus(msg) { statusEl.textContent = msg; }

// --- CAMERA INIT ---
window.addEventListener('DOMContentLoaded', () => {
  camLeft = new CameraCard(camBoxLeft, { facingMode: "environment", onStatus: setStatus });
  camRight = new CameraCard(camBoxRight, { facingMode: "environment", onStatus: setStatus });

  // LEFT HAND
  document.getElementById("startCamLeft").onclick = async () => {
    await camLeft.start();
    setStatus("Left hand camera started.");
  };
  document.getElementById("captureLeft").onclick = async () => {
    camLeft.captureTo(canvasLeft);
    setStatus("Left hand captured.");
    await autoPalmAI(canvasLeft, "left");
  };
  document.getElementById("uploadLeft").onclick = () => fileUpload(canvasLeft, () => autoPalmAI(canvasLeft, "left"));
  document.getElementById("torchLeft").onclick =.toggleTorch(); };

  // RIGHT HAND
  document.getElementById("startCamRight").onclick = async () => {
    await camRight.start();
    setStatus("Right hand camera started.");
  };
  document.getElementById("captureRight").onclick = async () => {
    camRight.captureTo(canvasRight").onclick = () => fileUpload(canvasRight, () => autoPalmAI(canvasRight, "right"));
  document.getElementById("torchRight").onclick = async () => { await camRight.toggleTorch(); };

  // Analyze (full report)
  document.getElementById("analyze").onclick = () => {
    if (leftPalmAI && rightPalmAI) {
      showPalmInsight(leftPalmAI, rightPalmAI, "full");
    } else {
      setStatus("Please capture/upload both hands first!");
    }
  };

  // Mini report
  document.getElementById("miniReport").onclick = () => {
    if (leftPalmAI && rightPalmAI) {
      showPalmInsight(leftPalmAI, rightPalmAI, "mini");
    } else {
      setStatus("Please capture/upload both hands first!");
    }
  };
});

// --- Palm Line AI + Drawing (DEMO AI) ---

async function autoPalmAI(canvas, hand) {
  setStatus("Detecting palm lines...");
  const aiResult = await fakePalmAI(canvas, hand);   // Replace with real AI call if needed
  drawPalmLinesOnCanvas(canvas, aiResult.lines);
  if (hand === "left") leftPalmAI = call) ---
async function fakePalmAI(canvas, hand="right") {
  const w = canvas.width, h = canvas.height;
  // Demo: 3 main lines, 2 minor
  const lines = [
    { name: "Heart Line", color: "red", main: true, points: [[w*0.2,h*0.25],[w*0.8,h*0.27]] },
    { name: "Head Line",  color: "blue", main: true, points: [[w*0.28,h*0.4],[w*0.7,h*0.5]] },
    { name: "Life Line",  color: "green", main: true, points: [[w*0.38,h*0.78],[w*0.2,h*0.98],[w*0.45,h*0.99]] },
    { name: "Health",     color: "#789", main: false, points: [[w*0.52,h*0.4],[w*0.6,h*0.7]] },
    { name: "Marriage",   color: "#555", main: false, points: [[w*0.7,h*0.2],[w*0.73,h*0.28]] }
  ];
  // Demo "reading": random but plausible
  const reading = [
    "Heart Line: Indicates strong emotions and empathy.",
    "Head Line: Suggests high intellect and curiosity.",
    "Life Line: Shows good vitality and adaptability.",
    ...(hand==="left" ? ["Past influences are strong."] : ["Active, creative present life."])
  ];
  return { hand, lines, reading };
}

// --- DRAW LINES ON CANVAS ---
function drawPalmLinesOnCanvas(canvas, palmLines) {
  const ctx = canvas.getContext('2d');
  ctx.save();
  palmLines.forEach(line => {
    ctx.save();
    ctx.strokeStyle = line.color;
    ctx.lineWidth = line.main ? 5 : 2;
    ctx.globalAlpha = line.main ? 1.0 : 0.7;
    if (!line.main) ctx.setLineDash([5, 5]);
    ctx.beginPath();
    line.points.forEach(([x, y], i) => {
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  });
  ctx.restore();
}

// --- FILE UPLOAD HANDLER ---
function fileUpload(canvas, callback) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(ev) {
4 aspect ratio
        let iw = img.width, ih = img.height;
        const aspect = 3/4;
        let tw = iw, th = ih;
        if (iw/ih > aspect) { tw = ih * aspect; th = ih; }
        else { tw = iw; th = iw / aspect; }
        canvas.width = tw; canvas.height = th;
        let ctx = canvas.getContext('2d');
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, tw, th);
        ctx.drawImage(img, (iw-tw)/2, (ih-th)/2, tw, th, 0, 0, tw, th);
        setStatus("Photo loaded.");
        if (callback) callback();
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };
  input.click();
}

// --- PALM READING OUTPUT ---
function showPalmInsight(left, right, mode="full") {
  let txt = `Sathya Darshana Quantum Palm Analyzer\n\n`;
  txt += `Left Hand:\n${left.reading.join("\n")}\n\n`;
  txt += `Right Hand:\n${right.reading.join("\n")}\n\n`;
  if (mode==="mini") {
    txt += "Mini Report: Most prominentetection & drawing** (demo AI)
- **Palm reading report** (mini/full)
- **No syntax errors**

---

**තව error/functionality/help/debug ඕන නම්, මෙතැන paste කරන්න!**
