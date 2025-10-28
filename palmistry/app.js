import { speak } from "./voice.js";
import { drawAIOverlay } from "./overlay.js";

const vids = {
  left: document.getElementById("vidLeft"),
  right: document.getElementById("vidRight"),
};
const reportBox = document.getElementById("reportBox");
window.currentLang = "en";

async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
    vids.left.srcObject = stream;
    vids.right.srcObject = stream;
    console.log("✅ Camera active");
  } catch (e) {
    alert("⚠️ Please allow camera permission.");
  }
}
startCamera();

function flashEffect(video) {
  const flash = document.createElement("div");
  flash.className = "flash";
  video.parentElement.appendChild(flash);
  setTimeout(() => flash.remove(), 700);
}

async function capture(side) {
  const video = vids[side];
  flashEffect(video);
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d").drawImage(video, 0, 0);
  const img = canvas.toDataURL("image/png");

  const report = `Mini Report (${side} hand): 
  Observed balanced lines, steady mind, inner wisdom and spiritual focus. 
  Life line strong, Heart line deep, Fate line subtle. 
  Reflects dedication and calm discipline.`;

  drawAIOverlay(canvas, side);
  reportBox.innerHTML = `<img src="${img}" width="160" style="border-radius:8px;margin:10px"/><p>${report}</p>`;
  speak(report, window.currentLang);
}

document.getElementById("capLeft").onclick = () => capture("left");
document.getElementById("capRight").onclick = () => capture("right");
document.getElementById("stopVoice").onclick = () => speechSynthesis.cancel();

document.getElementById("langSelect").onchange = (e) => {
  window.currentLang = e.target.value;
  speak(`Language set to ${e.target.options[e.target.selectedIndex].text}`, window.currentLang);
};
