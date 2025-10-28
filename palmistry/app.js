import { analyzePalm } from "./fusion.js";
import { speak } from "./voice.js";

const vids = { left: document.getElementById("vidLeft"), right: document.getElementById("vidRight") };
const reportBox = document.getElementById("reportBox");
const langSel = document.getElementById("langSelect");
window.currentLang = "en";

// ✅ Start camera
async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
    vids.left.srcObject = stream;
    vids.right.srcObject = stream;
    console.log("✅ Camera started");
  } catch (e) {
    alert("⚠️ Please allow camera permission.");
  }
}
startCamera();

// 📸 Capture + Analyze
async function capture(side) {
  const v = vids[side];
  const c = document.createElement("canvas");
  c.width = v.videoWidth; c.height = v.videoHeight;
  const ctx = c.getContext("2d");
  ctx.drawImage(v, 0, 0, c.width, c.height);
  const img = c.toDataURL("image/png");
  const result = await analyzePalm(img, side);
  const imgTag = `<img src="${img}" width="150" style="margin:10px;border-radius:8px;">`;
  reportBox.innerHTML += `${imgTag}${result}`;
  alert(`${side} hand captured successfully!`);
}
document.getElementById("capLeft").onclick = () => capture("left");
document.getElementById("capRight").onclick = () => capture("right");

// 🌐 Voice controls
langSel.onchange = () => {
  window.currentLang = langSel.value;
  speak(`Language set to ${langSel.options[langSel.selectedIndex].text}`, window.currentLang);
};
document.getElementById("stopVoice").onclick = () => speechSynthesis.cancel();
