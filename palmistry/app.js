import { analyzeRealPalm } from "./fusion.js";

const vids = {
  left: document.getElementById("vidLeft"),
  right: document.getElementById("vidRight")
};
const reportBox = document.getElementById("reportBox");
let isLocked = { left: false, right: false };
window.capturedHands = {}; // 🖐️ store captured images for PDF use

async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" }
    });
    vids.left.srcObject = stream;
    vids.right.srcObject = stream;
  } catch (e) {
    alert("Please allow camera permission 🙏");
  }
}
startCamera();

function flashEffect(v) {
  v.style.boxShadow = "0 0 25px #00e5ff";
  setTimeout(() => (v.style.boxShadow = ""), 800);
}

async function captureAndAnalyze(side) {
  if (isLocked[side]) {
    alert(`🔒 ${side} hand already locked!`);
    return;
  }

  const v = vids[side];
  const btn = document.getElementById(
    `cap${side.charAt(0).toUpperCase() + side.slice(1)}`
  );
  btn.disabled = true;
  btn.innerText = "🔄 Capturing...";
  isLocked[side] = true;

  const c = document.createElement("canvas");
  c.width = v.videoWidth;
  c.height = v.videoHeight;
  const ctx = c.getContext("2d");
  ctx.drawImage(v, 0, 0, c.width, c.height);

  const imgData = c.toDataURL("image/png");
  flashEffect(v);

  // 🖼️ store and preview captured hand
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

  // remove old report if exists
  const old = document.querySelector(`#report-${side}`);
  if (old) old.remove();

  const box = document.createElement("div");
  box.id = `report-${side}`;
  box.innerHTML = `<p>🧠 Processing ${side} hand...</p>`;
  reportBox.appendChild(box);

  const result = await analyzeRealPalm(imgData, side);
  box.innerHTML = result;

  btn.disabled = false;
  btn.innerText = "📸 Capture " + side.charAt(0).toUpperCase() + side.slice(1);
  isLocked[side] = false;
}

document.getElementById("capLeft").onclick = () => captureAndAnalyze("left");
document.getElementById("capRight").onclick = () => captureAndAnalyze("right");
