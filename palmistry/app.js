import { analyzeRealPalm } from "./fusion.js";

const vidL = document.getElementById("vidLeft");
const vidR = document.getElementById("vidRight");
const reportBox = document.getElementById("reportBox");

// 🎥 Start both cameras
async function startCam(v) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    v.srcObject = stream;
  } catch (e) {
    alert("Camera access blocked! Please allow camera permission.");
  }
}

startCam(vidL);
startCam(vidR);

document.getElementById("capLeft").onclick = () => captureAndAnalyze("left");
document.getElementById("capRight").onclick = () => captureAndAnalyze("right");

async function captureAndAnalyze(side) {
  const v = side === "left" ? vidL : vidR;
  const canvas = document.createElement("canvas");
  canvas.width = v.videoWidth;
  canvas.height = v.videoHeight;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
  const imgData = canvas.toDataURL("image/png");

  reportBox.innerHTML += `<p>🧠 Processing ${side} hand...</p>`;
  const result = await analyzeRealPalm(imgData, side);
  reportBox.innerHTML += result;
}
