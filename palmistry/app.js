import { analyzeRealPalm } from "./fusion.js";

const vids = {
  left: document.getElementById("vidLeft"),
  right: document.getElementById("vidRight")
};
const reportBox = document.getElementById("reportBox");
let isLocked = { left: false, right: false }; // 🔒 lock status

// 🎥 Start both cameras once
async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" }
    });
    vids.left.srcObject = stream;
    vids.right.srcObject = stream;
  } catch (err) {
    alert("Please allow camera permission 🙏");
  }
}
startCamera();

// ✨ visual flash
function flashEffect(videoEl) {
  videoEl.style.boxShadow = "0 0 25px #00e5ff";
  setTimeout(() => (videoEl.style.boxShadow = ""), 800);
}

// 📸 capture + lock logic
async function captureAndAnalyze(side) {
  if (isLocked[side]) {
    alert(`🔒 ${side} hand already locked!`);
    return;
  }

  const v = vids[side];
  const canvas = document.createElement("canvas");
  canvas.width = v.videoWidth;
  canvas.height = v.videoHeight;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(v, 0, 0, canvas.width, canvas.height);

  flashEffect(v);
  isLocked[side] = true; // lock this side
  document.getElementById(`cap${side.charAt(0).toUpperCase() + side.slice(1)}`).innerText = "🔒 Locked";

  const img = canvas.toDataURL("image/png");
  reportBox.innerHTML += `<p>🧠 Processing ${side} hand...</p>`;
  const result = await analyzeRealPalm(img, side);
  reportBox.innerHTML += result;
}

// 🧩 Connect buttons
document.getElementById("capLeft").onclick = () => captureAndAnalyze("left");
document.getElementById("capRight").onclick = () => captureAndAnalyze("right");
