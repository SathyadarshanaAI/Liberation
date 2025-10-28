import { drawAIOverlay } from "./overlay.js";
import { generateMiniReport } from "./report.js";
import { speak } from "./voice.js";

const vids = { left: vidLeft, right: vidRight };
let streams = { left: null, right: null };
let isLocked = { left: false, right: false };

// 🎥 Start each camera separately
async function startCamera(side) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
    vids[side].srcObject = stream;
    streams[side] = stream;
  } catch (e) {
    alert("⚠️ Allow camera permission to continue.");
  }
}

startCamera("left");
startCamera("right");

// 💾 Save user info
saveUser.onclick = () => {
  const data = { name: userName.value, dob: userDOB.value, id: userID.value };
  localStorage.setItem("userData", JSON.stringify(data));
  alert(`Saved for ${data.name || "User"}`);
};

// 📸 Capture + Analyze
async function captureAndAnalyze(side) {
  if (isLocked[side]) return;
  isLocked[side] = true;

  const v = vids[side];
  const c = document.createElement("canvas");
  c.width = v.videoWidth || 320;
  c.height = v.videoHeight || 240;
  const ctx = c.getContext("2d");
  ctx.drawImage(v, 0, 0, c.width, c.height);

  animateBeam(c.height);
  drawAIOverlay(c, side);

  // Stop only THIS side camera
  if (streams[side]) {
    streams[side].getTracks().forEach(t => t.stop());
    streams[side] = null;
    v.srcObject = null;
  }

  const img = c.toDataURL("image/png");
  const mini = await generateMiniReport(img, side);
  reportBox.innerHTML = `<img src="${img}" width="160" style="border-radius:8px;margin:8px;"><br>${mini}`;

  const txt = reportBox.textContent.slice(0, 280);
  speak(`Your ${side} hand analysis: ${txt}`, window.currentLang);
}

capLeft.onclick = () => captureAndAnalyze("left");
capRight.onclick = () => captureAndAnalyze("right");

// 🌈 Golden beam
function animateBeam(h) {
  const beam = document.getElementById("beam");
  beam.style.opacity = 1;
  let y = 0;
  const id = setInterval(() => {
    y += 5;
    beam.style.top = y + "px";
    if (y > h) {
      clearInterval(id);
      beam.style.opacity = 0;
    }
  }, 15);
}

// 🔊 Voice control
window.currentLang = "en";
langSelect.onchange = () => (window.currentLang = langSelect.value);
stopVoice.onclick = () => speechSynthesis.cancel();
