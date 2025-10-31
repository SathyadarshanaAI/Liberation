// 🕉️ Sathyadarshana Quantum Palm Analyzer · V15.2 Dharma Aura Edition
// camera.js — Secure Camera Controller for AI Buddhi System

export async function startCam(side, statusEl) {
  const isSecure =
    window.isSecureContext ||
    location.protocol === "https:" ||
    location.hostname === "localhost";

  // 🔒 Check HTTPS or localhost
  if (!isSecure) {
    statusEl.textContent =
      "❌ Camera requires HTTPS or localhost.\nPlease open this page securely (https://)";
    statusEl.style.color = "#ff6b6b";
    console.warn("Insecure origin: getUserMedia blocked.");
    return;
  }

  try {
    const vid =
      document.getElementById(side === "left" ? "vidLeft" : "vidRight");
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
      audio: false,
    });

    vid.srcObject = stream;
    await vid.play();

    // ✅ UI feedback
    statusEl.textContent = `${side.toUpperCase()} camera started ✅`;
    statusEl.style.color = "#16f0a7";
    console.log(`🎥 ${side} camera active`);
  } catch (e) {
    statusEl.textContent = `❌ Camera error: ${e.name} (${e.message})`;
    statusEl.style.color = "#ff6b6b";
    console.error("Camera failed:", e);
  }
}

// === Capture image from video ===
export function capture(side, onCtx) {
  const vid =
    document.getElementById(side === "left" ? "vidLeft" : "vidRight");
  const cvs =
    document.getElementById(side === "left" ? "canvasLeft" : "canvasRight");

  if (!vid || !cvs) {
    console.warn("⚠️ Capture failed: missing canvas or video element");
    return;
  }

  const ctx = cvs.getContext("2d");
  ctx.drawImage(vid, 0, 0, cvs.width, cvs.height);

  // subtle flash animation
  cvs.style.boxShadow = "0 0 25px #00e5ff";
  setTimeout(() => (cvs.style.boxShadow = "none"), 400);

  if (typeof onCtx === "function") onCtx(ctx);
  console.log(`📸 ${side} hand captured`);
}
