// 🕉️ app.js — working camera + beam + report system
import { speak } from "./voice.js";
import { generateMiniReport } from "./report.js";

const vids = { left: vidLeft, right: vidRight };
let stream = null;
let isLocked = { left: false, right: false };

// 🎥 Start camera once
async function startCamera() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
    vids.left.srcObject = stream;
    vids.right.srcObject = stream;
    console.log("✅ Camera started");
  } catch (e) {
    alert("⚠️ Camera permission denied or unavailable.");
    console.error(e);
  }
}
startCamera();

// 💾 Save user info
saveUser.onclick = () => {
  const data = {
    name: userName.value,
    dob: userDOB.value,
    id: userID.value,
  };
  localStorage.setItem("userData", JSON.stringify(data));
  alert(`Saved for ${data.name || "User"}`);
};

// 📸 Capture both hands
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

  // Stop camera like shutter
  stream.getTracks().forEach((t) => t.stop());
  v.srcObject = null;

  const img = c.toDataURL("image/png");
  const mini = await generateMiniReport(img, side);
  reportBox.innerHTML = `
    <img src="${img}" width="160" style="border-radius:8px;margin:8px;">
    <br>${mini}
  `;
  speak(`Your ${side} hand has been analyzed.`, window.currentLang);
}

capLeft.onclick = () => captureAndAnalyze("left");
capRight.onclick = () => captureAndAnalyze("right");

// 🌈 Golden scanning beam
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
  }, 10);
}

// 🔊 Voice select
window.currentLang = "en";
langSelect.onchange = () => (window.currentLang = langSelect.value);
stopVoice.onclick = () => speechSynthesis.cancel();
