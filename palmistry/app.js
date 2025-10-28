import { speak } from "./voice.js";
import { analyzeRealPalm } from "./fusion.js";

const vids = {
  left: document.getElementById("vidLeft"),
  right: document.getElementById("vidRight"),
};
let isLocked = { left: false, right: false };
window.currentLang = "en";

async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
    vids.left.srcObject = stream;
    vids.right.srcObject = stream;
    console.log("✅ Camera started");
  } catch (e) {
    alert("⚠️ Please allow camera permission in browser settings.");
  }
}
startCamera();

async function captureAndAnalyze(side) {
  if (isLocked[side]) return alert(`${side} hand already captured.`);
  isLocked[side] = true;

  const v = vids[side];
  const c = document.createElement("canvas");
  c.width = v.videoWidth || 320;
  c.height = v.videoHeight || 240;
  c.getContext("2d").drawImage(v, 0, 0, c.width, c.height);

  const imgData = c.toDataURL("image/png");
  const preview = document.createElement("img");
  preview.src = imgData;
  preview.style.width = "160px";
  preview.style.borderRadius = "8px";
  preview.style.margin = "8px";
  document.getElementById("reportBox").prepend(preview);

  const report = await analyzeRealPalm(imgData, side);
  document.getElementById("reportBox").innerHTML += report;
  speak(report.replace(/<[^>]+>/g, ""), window.currentLang);
  alert(`${side} hand captured successfully!`);

  isLocked[side] = false;
}

document.getElementById("capLeft").onclick = () => captureAndAnalyze("left");
document.getElementById("capRight").onclick = () => captureAndAnalyze("right");

document.getElementById("langSelect").onchange = (e) => {
  window.currentLang = e.target.value;
  speak(`Language set to ${e.target.options[e.target.selectedIndex].text}`, window.currentLang);
};
document.getElementById("stopVoice").onclick = () => speechSynthesis.cancel();
