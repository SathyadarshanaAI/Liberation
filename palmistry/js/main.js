let streamL, streamR;

// --- CAMERA CONTROL ---
async function startCam(side) {
  const vid = document.getElementById(side === "left" ? "vidLeft" : "vidRight");
  try {
    const st = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
    vid.srcObject = st;
    if (side === "left") streamL = st; else streamR = st;
    setStatus(`${side.toUpperCase()} camera started ✅`);
  } catch (err) {
    setStatus(`❌ Camera error: ${err.message}`, false);
  }
}

function setStatus(msg, ok = true) {
  const el = document.getElementById("status");
  el.textContent = msg;
  el.style.color = ok ? "#16f0a7" : "#ff6b6b";
}

// --- CAPTURE & ANALYZE ---
function capture(side) {
  const vid = document.getElementById(side === "left" ? "vidLeft" : "vidRight");
  const cvs = document.getElementById(side === "left" ? "canvasLeft" : "canvasRight");
  const ctx = cvs.getContext("2d");
  ctx.drawImage(vid, 0, 0, cvs.width, cvs.height);

  // stop camera feed
  const stream = vid.srcObject;
  if (stream) {
    stream.getTracks().forEach(t => t.stop());
    vid.srcObject = null;
  }
  vid.style.opacity = "0"; // hide live feed
  cvs.style.visibility = "visible"; // show locked hand

  animateBeam(cvs);

  setTimeout(() => {
    generateReport(side);
  }, 2000);
}

// --- AURA SCAN LINE ---
function animateBeam(canvas) {
  const beam = document.createElement("div");
  beam.className = "beam";
  canvas.parentElement.appendChild(beam);
  setTimeout(() => beam.remove(), 2000);
}

// --- AI DHARMA ANALYZER ---
function generateReport(side) {
  const dharma = [
    "Your heart line glows with compassion and inner strength.",
    "Your head line reveals clarity guided by divine intuition.",
    "Fate aligns with your karma — a new path is opening.",
    "You carry a radiant aura — wisdom and emotion in balance.",
    "Your hand bears the mark of dharma — light flowing through action."
  ];
  const msg = dharma[Math.floor(Math.random() * dharma.length)];
  const box = document.getElementById("reportBox");
  box.innerHTML = `📜 ${side.toUpperCase()} hand captured.<br><b>Dharma Insight:</b> ${msg}`;
  speak(msg);
}

// --- VOICE SYNTHESIS ---
function speak(text) {
  if (!window.speechSynthesis) return;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "en-US";
  utter.pitch = 1;
  utter.rate = 0.9;
  speechSynthesis.speak(utter);
}

// --- BUTTON LINKS ---
document.getElementById("startCamLeft").onclick = () => startCam("left");
document.getElementById("startCamRight").onclick = () => startCam("right");
document.getElementById("captureLeft").onclick = () => capture("left");
document.getElementById("captureRight").onclick = () => capture("right");

setStatus("System ready ✨ Tap Start to begin");
