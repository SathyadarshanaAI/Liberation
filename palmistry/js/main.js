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

  animateBeam(cvs);

  // Fade effect after scan
  setTimeout(() => {
    cvs.classList.add("fadeout");
  }, 2000);

  // Generate report with slight delay
  setTimeout(() => {
    generateReport(side);
  }, 2500);
}

// --- AURA & BEAM EFFECT ---
function animateBeam(canvas) {
  const beam = document.createElement("div");
  beam.className = "beam";
  canvas.parentElement.style.position = "relative";
  canvas.parentElement.appendChild(beam);
  setTimeout(() => beam.remove(), 2000);
}

// --- AI DHARMA ANALYZER ---
function generateReport(side) {
  const reports = [
    "Your heart line reveals compassion and balanced emotion.",
    "Your head line shows deep intuition guided by wisdom.",
    "The fate line indicates powerful transformation ahead.",
    "Your palm glows with harmony — karma and awareness aligned.",
    "You carry the mark of light — your actions sow serenity."
  ];
  const msg = reports[Math.floor(Math.random() * reports.length)];
  const box = document.getElementById("reportBox");
  box.innerHTML = `📜 ${side} hand captured.<br><b>Dharma Insight:</b> ${msg}`;
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
