// app.js — Core Camera Logic
console.log("📸 Palm Analyzer V12 Voice Fusion Edition starting...");

async function startCamera(videoEl) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
      audio: false
    });
    videoEl.srcObject = stream;
    console.log("✅ Camera started");
  } catch (err) {
    alert("Camera access denied or unavailable: " + err.message);
    console.error("Camera error:", err);
  }
}

function captureFrame(videoEl, side) {
  const canvas = document.createElement("canvas");
  canvas.width = videoEl.videoWidth || 320;
  canvas.height = videoEl.videoHeight || 240;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);

  const dataURL = canvas.toDataURL("image/png");
  localStorage.setItem(`palm_${side}`, dataURL);

  console.log(`🖐️ ${side} hand captured`);
  alert(`${side} hand captured successfully!`);
}

// Initialize
window.addEventListener("DOMContentLoaded", () => {
  const vidLeft = document.getElementById("vidLeft");
  const vidRight = document.getElementById("vidRight");

  // start both cameras sequentially (fallback if only one available)
  startCamera(vidLeft);
  startCamera(vidRight);

  document.getElementById("capLeft").onclick = () => captureFrame(vidLeft, "left");
  document.getElementById("capRight").onclick = () => captureFrame(vidRight, "right");
});
