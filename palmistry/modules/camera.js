// modules/camera.js — V10.2 Stable Camera Fix Build
import { emit } from './bus.js';

console.log("Camera module active");
emit("module:camera", { ok:true });

export async function startCamera(side) {
  const vid = document.getElementById(`vid-${side}`);
  const status = document.getElementById("status");

  try {
    status.textContent = `📷 Opening ${side} camera…`;

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" }, // back camera
      audio: false
    });

    vid.srcObject = stream;
    vid.setAttribute("playsinline", true);
    await vid.play(); // ✅ ensures autoplay starts on mobile
    status.textContent = `✅ ${side} camera active`;

    emit("camera:ready", { side });
  } catch (err) {
    console.error("Camera error:", err);
    status.textContent = "❌ Camera blocked or unavailable.";
  }
}

export function capture(side) {
  const vid = document.getElementById(`vid-${side}`);
  const canvas = document.getElementById(`canvas-${side}`);
  const ctx = canvas.getContext("2d");

  if (!vid.srcObject) {
    alert("Camera not started yet.");
    return;
  }

  canvas.style.display = "block";
  ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);
  flashEffect(canvas);

  const msg = `🖐️ ${side} hand captured — analyzing palm lines...`;
  document.getElementById("reportBox").textContent = msg;

  emit("capture:done", { side, time: Date.now() });
}

function flashEffect(el) {
  el.style.boxShadow = "0 0 30px #16f0a7";
  setTimeout(() => (el.style.boxShadow = "none"), 400);
}
