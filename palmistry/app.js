import { analyzeRealPalm } from "./fusion.js";
import { drawAIOverlay } from "./overlay.js";

const vids = { left: document.getElementById("vidLeft"), right: document.getElementById("vidRight") };
const reportBox = document.getElementById("reportBox");
let isLocked = { left: false, right: false };

async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
    vids.left.srcObject = stream;
    vids.right.srcObject = stream;
  } catch (e) {
    alert("Please allow camera permission 🙏");
  }
}
startCamera();

async function captureAndAnalyze(side) {
  if (isLocked[side]) { alert(`🔒 ${side} hand already locked!`); return; }
  isLocked[side] = true;

  const v = vids[side];
  const c = document.createElement("canvas");
  c.width = v.videoWidth;
  c.height = v.videoHeight;
  const ctx = c.getContext("2d");
  ctx.drawImage(v, 0, 0, c.width, c.height);

  // 🧠 AI Overlay (Quantum Line Map)
  drawAIOverlay(c, side);

  const imgData = c.toDataURL("image/png");
  window.capturedHands[side] = imgData;

  const preview = document.createElement("img");
  preview.src = imgData;
  preview.style.width = "160px";
  preview.style.borderRadius = "8px";
  preview.style.margin = "10px";
  preview.alt = `${side} hand`;
  const oldPrev = document.querySelector(`#preview-${side}`);
  if (oldPrev) oldPrev.remove();
  preview.id = `preview-${side}`;
  reportBox.prepend(preview);

  // 🧾 Generate report
  const result = await analyzeRealPalm(imgData, side);
  const old = document.querySelector(`#report-${side}`);
  if (old) old.remove();

  const box = document.createElement("div");
  box.id = `report-${side}`;
  box.innerHTML = result;
  reportBox.appendChild(box);

  isLocked[side] = false;
}

document.getElementById("capLeft").onclick = () => captureAndAnalyze("left");
document.getElementById("capRight").onclick = () => captureAndAnalyze("right");
