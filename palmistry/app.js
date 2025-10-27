import { analyzeRealPalm } from "./fusion.js";

const vids = {
  left: document.getElementById("vidLeft"),
  right: document.getElementById("vidRight")
};
const reportBox = document.getElementById("reportBox");

// 🎥 Initialize camera once
async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" } // back camera for phones
    });
    vids.left.srcObject = stream;
    vids.right.srcObject = stream;
  } catch (err) {
    alert("Please allow camera permission 🙏");
  }
}

startCamera();

// 📸 capture + send for analysis
async function captureAndAnalyze(side) {
  const v = vids[side];
  const c = document.createElement("canvas");
  c.width = v.videoWidth;
  c.height = v.videoHeight;
  const ctx = c.getContext("2d");
  ctx.drawImage(v, 0, 0, c.width, c.height);

  const img = c.toDataURL("image/png");
  reportBox.innerHTML += `<p>🧠 Processing ${side} hand...</p>`;
  const result = await analyzeRealPalm(img, side);
  reportBox.innerHTML += result;
}

document.getElementById("capLeft").onclick = () => captureAndAnalyze("left");
document.getElementById("capRight").onclick = () => captureAndAnalyze("right");
