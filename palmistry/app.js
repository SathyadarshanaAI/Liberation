import { analyzeRealPalm } from "./fusion.js";

const vids = {
  left: document.getElementById("vidLeft"),
  right: document.getElementById("vidRight")
};
const reportBox = document.getElementById("reportBox");
let isLocked = { left: false, right: false };

// 🎥 start camera once
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

// ✨ flash feedback
function flashEffect(el) {
  el.style.boxShadow = "0 0 25px #00e5ff";
  setTimeout(() => (el.style.boxShadow = ""), 800);
}

// 📸 capture
async function captureAndAnalyze(side) {
  if (isLocked[side]) {
    alert(`🔒 ${side} hand already locked!`);
    return;
  }

  const btn = document.getElementById(
    `cap${side.charAt(0).toUpperCase() + side.slice(1)}`
  );
  btn.disabled = true;
  btn.innerText = "🔄 Capturing...";
  isLocked[side] = true;

  const v = vids[side];
  const c = document.createElement("canvas");
  c.width = v.videoWidth;
  c.height = v.videoHeight;
  const ctx = c.getContext("2d");
  ctx.drawImage(v, 0, 0, c.width, c.height);

  flashEffect(v);
  const img = c.toDataURL("image/png");

  // clear old report for that side
  const old = document.querySelector(`#report-${side}`);
  if (old) old.remove();

  const box = document.createElement("div");
  box.id = `report-${side}`;
  box.innerHTML = `<p>🧠 Processing ${side} hand...</p>`;
  reportBox.appendChild(box);

  const result = await analyzeRealPalm(img, side);
  box.innerHTML = result;

  // unlock for new scan if needed
  btn.disabled = false;
  btn.innerText = "📸 Capture " + side.charAt(0).toUpperCase() + side.slice(1);
  isLocked[side] = false;
}

document.getElementById("capLeft").onclick = () => captureAndAnalyze("left");
document.getElementById("capRight").onclick = () => captureAndAnalyze("right");
