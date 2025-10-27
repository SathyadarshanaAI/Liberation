// 🕉️ Sathyadarshana Quantum Palm Analyzer V11.7 · MultiVoice + Overlay Edition
import { analyzeRealPalm } from "./fusion.js";
import { drawAIOverlay } from "./overlay.js";
import { speak } from "./voice.js";

// 🎥 Camera setup
const vids = {
  left: document.getElementById("vidLeft"),
  right: document.getElementById("vidRight")
};
const reportBox = document.getElementById("reportBox");
let isLocked = { left: false, right: false };
window.capturedHands = {};

// ✅ Start camera once for both sides
async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" }
    });
    vids.left.srcObject = stream;
    vids.right.srcObject = stream;
    console.log("✅ Camera stream active");
  } catch (e) {
    alert("⚠️ Please allow camera permission from browser settings.");
  }
}
startCamera();

// 🧠 Capture + Analyze + Overlay
async function captureAndAnalyze(side) {
  if (isLocked[side]) {
    alert(`🔒 ${side} hand already captured.`);
    return;
  }
  isLocked[side] = true;

  const v = vids[side];
  const c = document.createElement("canvas");
  c.width = v.videoWidth || 320;
  c.height = v.videoHeight || 240;
  const ctx = c.getContext("2d");
  ctx.drawImage(v, 0, 0, c.width, c.height);

  // 🌈 AI Overlay (Quantum Line Map)
  drawAIOverlay(c, side);

  // 📸 Save and preview
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

  // 🧾 Generate AI Report
  const result = await analyzeRealPalm(imgData, side);
  const old = document.querySelector(`#report-${side}`);
  if (old) old.remove();

  const box = document.createElement("div");
  box.id = `report-${side}`;
  box.innerHTML = result;
  reportBox.appendChild(box);

  // 🔊 Speak report summary
  const plainText = box.textContent.slice(0, 280);
  speak(`Here is your ${side} hand analysis: ${plainText}`, window.currentLang);

  isLocked[side] = false;
}

// 📷 Capture buttons
document.getElementById("capLeft").onclick = () => captureAndAnalyze("left");
document.getElementById("capRight").onclick = () => captureAndAnalyze("right");

// 🌐 Voice Language Control
const select = document.getElementById("langSelect");
window.currentLang = "en";
select.onchange = () => {
  window.currentLang = select.value;
  speak(`Language set to ${select.options[select.selectedIndex].text}`, window.currentLang);
};

document.getElementById("stopVoice").onclick = () => {
  speechSynthesis.cancel();
  console.log("🔇 Voice stopped");
};
