import { drawAIOverlay } from "./overlay.js";
import { generateMiniReport } from "./report.js";
import { speak } from "./voice.js";

const vids = { left: vidLeft, right: vidRight };
let isLocked = { left: false, right: false };
let stream = null;

// 🎥 Start camera
async function startCamera() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
    vids.left.srcObject = stream;
    vids.right.srcObject = stream;
  } catch (e) {
    alert("⚠️ Allow camera permission to continue.");
  }
}
startCamera();

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
  c.width = v.videoWidth;
  c.height = v.videoHeight;
  const ctx = c.getContext("2d");
  ctx.drawImage(v, 0, 0, c.width, c.height);

  animateBeam(c.height);
  drawAIOverlay(c, side);

  // simulate shutter close
  stream.getTracks().forEach(t => t.stop());
  v.srcObject = null;

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
langSelect.onchange = () => window.currentLang = langSelect.value;
stopVoice.onclick = () => speechSynthesis.cancel();
