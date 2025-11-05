import { drawPalm } from "./lines.js";

let leftCaptured = false;
let rightCaptured = false;

async function startCam(side) {
  const vid = document.getElementById(side === "left" ? "vidLeft" : "vidRight");
  const canvas = document.getElementById(side === "left" ? "canvasLeft" : "canvasRight");

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: "environment" } },
      audio: false
    });
    vid.srcObject = stream;
    vid.style.display = "block";
    canvas.style.display = "none";
    document.getElementById("status").textContent = `📷 ${side} camera started`;
  } catch {
    alert(`Please allow camera access for ${side} hand`);
  }
}

function capture(side) {
  const vid = document.getElementById(side === "left" ? "vidLeft" : "vidRight");
  const canvas = document.getElementById(side === "left" ? "canvasLeft" : "canvasRight");
  const ctx = canvas.getContext("2d");

  const vw = vid.videoWidth;
  const vh = vid.videoHeight;
  const cw = canvas.width;
  const ch = (vh / vw) * cw;
  canvas.height = ch;

  ctx.drawImage(vid, 0, 0, cw, ch);

  const stream = vid.srcObject;
  if (stream) stream.getTracks().forEach(t => t.stop());
  vid.style.display = "none";
  canvas.style.display = "block";

  fixLighting(canvas);
  addBeamOverlay(canvas);

  // 🧠 Draw AI Palm Lines
  drawPalm(ctx);

  document.getElementById("status").textContent = `✅ ${side} palm captured`;
  if (side === "left") leftCaptured = true;
  else rightCaptured = true;
  if (leftCaptured && rightCaptured) analyzeAI();
}

function fixLighting(canvas) {
  const ctx = canvas.getContext("2d");
  const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = img.data;
  let sum = 0;
  for (let i = 0; i < data.length; i += 4)
    sum += 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
  const brightness = sum / (data.length / 4);
  const factor = brightness < 100 ? 1.2 : brightness > 180 ? 0.85 : 1.0;
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.min(255, data[i] * factor);
    data[i + 1] = Math.min(255, data[i + 1] * factor);
    data[i + 2] = Math.min(255, data[i + 2] * factor);
  }
  ctx.putImageData(img, 0, 0);
}

function addBeamOverlay(canvas) {
  const ctx = canvas.getContext("2d");
  const w = canvas.width, h = canvas.height;

  const beam = document.createElement("canvas");
  beam.width = w; beam.height = h;
  const bctx = beam.getContext("2d");
  const grad = bctx.createRadialGradient(w/2, h/2, 30, w/2, h/2, w/1.2);
  grad.addColorStop(0, "rgba(0,255,255,0.20)");
  grad.addColorStop(0.5, "rgba(255,215,0,0.10)");
  grad.addColorStop(1, "rgba(0,0,0,0)");
  bctx.fillStyle = grad;
  bctx.fillRect(0, 0, w, h);

  const img = ctx.getImageData(0, 0, w, h);
  ctx.clearRect(0, 0, w, h);
  ctx.drawImage(beam, 0, 0);
  ctx.putImageData(img, 0, 0);
}

function analyzeAI() {
  document.getElementById("status").textContent = "🤖 Buddhi AI analyzing palm lines...";
  setTimeout(() => {
    document.getElementById("status").textContent =
      "✨ AI Report Ready – True Vision Mode Activated 🔮";
  }, 2500);
}

document.getElementById("startCamLeft").onclick = () => startCam("left");
document.getElementById("captureLeft").onclick = () => capture("left");
document.getElementById("startCamRight").onclick = () => startCam("right");
document.getElementById("captureRight").onclick = () => capture("right");
