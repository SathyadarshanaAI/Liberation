import { CameraCard } from './modules/camara.js';

// ---------- ELEMENTS ----------
const camBoxLeft  = document.getElementById("camBoxLeft");
const camBoxRight = document.getElementById("camBoxRight");
const canvasLeft  = document.getElementById("canvasLeft");
const canvasRight = document.getElementById("canvasRight");
const statusEl    = document.getElementById("status");
const insightEl   = document.getElementById("insight");

// ---------- HELPERS ----------
function setStatus(msg) {
  if (typeof window.statusMsg === "function") window.statusMsg(msg);
  statusEl.textContent = msg;
  console.log("[STATUS]", msg);
}

// ---------- CAMERA INSTANCES ----------
let camLeft, camRight;
let leftPalmAI = null, rightPalmAI = null;

// ---------- MAIN ----------
window.addEventListener("DOMContentLoaded", () => {
  camLeft  = new CameraCard(camBoxLeft,  { facingMode: "environment", onStatus: setStatus });
  camRight = new CameraCard(camBoxRight, { facingMode: "environment", onStatus: setStatus });

  // --- LEFT HAND ---
  document.getElementById("startCamLeft").onclick = async () => {
    await camLeft.start();
    setStatus("Left hand camera started.");
  };

  document.getElementById("captureLeft").onclick = async () => {
    camLeft.captureTo(canvasLeft);
    setStatus("Left hand captured.");
    await autoPalmAI(canvasLeft, "left");
  };

  document.getElementById("uploadLeft").onclick = () =>
    fileUpload(canvasLeft, () => autoPalmAI(canvasLeft, "left"));

  document.getElementById("torchLeft").onclick = async () => {
    await camLeft.toggleTorch();
  };

  // --- RIGHT HAND ---
  document.getElementById("startCamRight").onclick = async () => {
    await camRight.start();
    setStatus("Right hand camera started.");
  };

  document.getElementById("captureRight").onclick = async () => {
    camRight.captureTo(canvasRight);
    setStatus("Right hand captured.");
    await autoPalmAI(canvasRight, "right");
  };

  document.getElementById("uploadRight").onclick = () =>
    fileUpload(canvasRight, () => autoPalmAI(canvasRight, "right"));

  document.getElementById("torchRight").onclick = async () => {
    await camRight.toggleTorch();
  };

  // --- ANALYZE (FULL REPORT) ---
  document.getElementById("analyze").onclick = () => {
    if (leftPalmAI && rightPalmAI) {
      showPalmInsight(leftPalmAI, rightPalmAI, "full");
    } else {
      setStatus("Please capture/upload both hands first!");
    }
  };

  // --- MINI REPORT ---
  document.getElementById("miniReport").onclick = () => {
    if (leftPalmAI && rightPalmAI) {
      showPalmInsight(leftPalmAI, rightPalmAI, "mini");
    } else {
      setStatus("Please capture/upload both hands first!");
    }
  };
});

// ---------- PALM AI ----------
async function autoPalmAI(canvas, hand) {
  setStatus(`Detecting ${hand} palm lines...`);
  const aiResult = await fakePalmAI(canvas, hand);
  drawPalmLinesOnCanvas(canvas, aiResult.lines);
  if (hand === "left") leftPalmAI = aiResult; else rightPalmAI = aiResult;
  setStatus(`${hand} palm lines auto-drawn.`);
}

// ---------- DEMO AI ----------
async function fakePalmAI(canvas, hand = "right") {
  const w = canvas.width, h = canvas.height;
  const lines = [
    { name: "Heart Line", color: "red",   main: true,  points: [[w*0.2,h*0.25],[w*0.8,h*0.27]] },
    { name: "Head Line",  color: "blue",  main: true,  points: [[w*0.28,h*0.4],[w*0.7,h*0.5]] },
    { name: "Life Line",  color: "green", main: true,  points: [[w*0.38,h*0.78],[w*0.2,h*0.98],[w*0.45,h*0.99]] },
    { name: "Health",     color: "#789",  main: false, points: [[w*0.52,h*0.4],[w*0.6,h*0.7]] },
    { name: "Marriage",   color: "#555",  main: false, points: [[w*0.7,h*0.2],[w*0.73,h*0.28]] }
  ];
  const reading = [
    "Heart Line: Indicates strong emotions and empathy.",
    "Head Line: Suggests high intellect and curiosity.",
    "Life Line: Shows good vitality and adaptability.",
    ...(hand === "left" ? ["Past influences are strong."] : ["Active, creative present life."])
  ];
  return { hand, lines, reading };
}

// ---------- DRAW PALM LINES ----------
function drawPalmLinesOnCanvas(canvas, palmLines) {
  const ctx = canvas.getContext("2d");
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

// ---------- FILE UPLOAD ----------
function fileUpload(canvas, callback) {
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
        let iw = img.width, ih = img.height;
        const aspect = 3 / 4;
        let tw = iw, th = ih;
        if (iw / ih > aspect) { tw = ih * aspect; th = ih; }
        else { tw = iw; th = iw / aspect; }
        canvas.width = tw; canvas.height = th;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, tw, th);
        ctx.drawImage(img, (iw - tw)/2, (ih - th)/2, tw, th, 0, 0, tw, th);
        setStatus("Photo loaded.");
        if (callback) callback();
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };
  input.click();
}

// ---------- REPORT OUTPUT ----------
function showPalmInsight(left, right, mode = "full") {
  let txt = `Sathya Darshana Quantum Palm Analyzer\n\n`;
  txt += `Left Hand:\n${left.reading.join("\n")}\n\n`;
  txt += `Right Hand:\n${right.reading.join("\n")}\n\n`;
  if (mode === "mini") txt += "Mini Report: Most prominent lines analyzed above.\n";
  else txt += "Full Report: See above for all detected lines.\n";
  insightEl.textContent = txt;
}
