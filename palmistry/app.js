const $ = id => document.getElementById(id);
const statusEl = $("status");
const leftVid = $("vidLeft");
const rightVid = $("vidRight");
const leftCv = $("canvasLeft");
const rightCv = $("canvasRight");

function msg(txt, ok = true) {
  statusEl.textContent = txt;
  statusEl.style.color = ok ? "#16f0a7" : "#ff6b6b";
}

// --- Camera Start ---
async function startCam(side) {
  const video = side === "left" ? leftVid : rightVid;
  try {
    // Ask permission if not already granted
    const devices = await navigator.mediaDevices.enumerateDevices();
    const hasVideo = devices.some(d => d.kind === "videoinput");
    if (!hasVideo) {
      msg("No camera detected 🚫", false);
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
      audio: false
    });
    video.srcObject = stream;
    await video.play();
    msg(`${side} camera started ✅`);
  } catch (e) {
    console.error(e);
    msg(`Camera Error: ${e.message}`, false);
  }
}

// --- Capture ---
function capture(side) {
  const video = side === "left" ? leftVid : rightVid;
  const canvas = side === "left" ? leftCv : rightCv;
  try {
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    msg(`${side} hand captured 🔒`);
  } catch (e) {
    msg(`Capture failed: ${e.message}`, false);
  }
}

// --- Button bindings ---
$("startLeft").onclick = () => startCam("left");
$("startRight").onclick = () => startCam("right");
$("captureLeft").onclick = () => capture("left");
$("captureRight").onclick = () => capture("right");

// --- Init check ---
(async () => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    msg("Camera not supported on this device ❌", false);
  } else {
    msg("Ready. Click Start to begin 🎥");
  }
})();
