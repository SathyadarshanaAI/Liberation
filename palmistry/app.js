// app.js (ESM)
const $ = (sel, root = document) => root.querySelector(sel);

const app = $("#app");
app.innerHTML = `
  <h1 style="color:#00e5ff;margin:14px 0 6px">Quantum Palm Analyzer v4.6</h1>
  <p id="status" style="opacity:.9;margin:0 0 10px">Ready</p>

  <div style="display:grid;gap:10px;place-items:center">
    <video id="video" playsinline autoplay muted
      style="width:92vw;max-width:420px;border-radius:16px;border:2px solid #16f0a7;background:#000"></video>

    <canvas id="overlay"
      style="position:absolute;inset:auto; width:92vw;max-width:420px; border-radius:16px; display:none"></canvas>

    <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center">
      <button id="open"  style="padding:10px 14px;border-radius:12px;border:1px solid #00e5ff;background:#0b0f16;color:#00e5ff;font-weight:600">Open Camera</button>
      <button id="snap"  style="padding:10px 14px;border-radius:12px;border:1px solid #16f0a7;background:#0b0f16;color:#16f0a7;font-weight:600" disabled>Snap</button>
      <button id="close" style="padding:10px 14px;border-radius:12px;border:1px solid #444;background:#0b0f16;color:#ddd" disabled>Close</button>
    </div>
  </div>
`;

const statusEl = $("#status");
const video    = $("#video");
const overlay  = $("#overlay");
const btnOpen  = $("#open");
const btnSnap  = $("#snap");
const btnClose = $("#close");

let stream;

/** Utils */
const setStatus = (t) => (statusEl.textContent = t);
const secureOK = () =>
  location.protocol === "https:" || location.hostname === "localhost" || location.hostname === "127.0.0.1";

/** Camera */
async function openCamera() {
  if (!secureOK()) {
    setStatus("Camera requires HTTPS or localhost.");
    alert("Use HTTPS (GitHub Pages/Cloudflare Pages) or run on localhost.");
    return;
  }
  if (!navigator.mediaDevices?.getUserMedia) {
    setStatus("Camera API not supported on this browser.");
    return;
  }
  try {
    setStatus("Requesting camera…");
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
      audio: false
    });
    video.srcObject = stream;
    await video.play(); // iOS: needs user gesture (button click) – we’re in one.

    btnSnap.disabled  = false;
    btnClose.disabled = true;   // give it a sec to stabilize
    setTimeout(() => (btnClose.disabled = false), 400);
    setStatus("Camera ON. Hold your palm steady and fill the frame.");
  } catch (err) {
    console.warn(err);
    setStatus("Camera error: " + (err.message || err));
    alert("Camera access failed.\n" + err);
  }
}

function closeCamera() {
  if (stream) {
    for (const t of stream.getTracks()) t.stop();
    stream = null;
    video.srcObject = null;
  }
  btnSnap.disabled = true;
  btnClose.disabled = true;
  setStatus("Camera OFF.");
}

function snapAndHighlight() {
  if (!video.videoWidth) {
    setStatus("Waiting for video… try again.");
    return;
  }
  overlay.width  = video.videoWidth;
  overlay.height = video.videoHeight;
  overlay.style.display = "block";

  const ctx = overlay.getContext("2d");
  ctx.drawImage(video, 0, 0, overlay.width, overlay.height);

  // 🔎 Very simple “fake highlight” demo (edge-ish effect):
  // Downscale -> edges -> blend neon stroke (placeholder for your real analyzer)
  const img = ctx.getImageData(0, 0, overlay.width, overlay.height);
  // cheap gradient magnitude on luma
  const w = overlay.width, h = overlay.height, data = img.data;
  const luma = new Uint8ClampedArray(w*h);
  for (let i=0, p=0; i<data.length; i+=4, p++) {
    luma[p] = (data[i]*0.2126 + data[i+1]*0.7152 + data[i+2]*0.0722) | 0;
  }
  const edges = new Uint8ClampedArray(w*h);
  for (let y=1; y<h-1; y++) {
    for (let x=1; x<w-1; x++) {
      const i = y*w + x;
      const gx = luma[i+1] - luma[i-1];
      const gy = luma[i+w] - luma[i-w];
      const mag = Math.min(255, Math.abs(gx)+Math.abs(gy));
      edges[i] = mag;
    }
  }
  // Draw neon lines where edges are strong
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = "#00e5ff";
  ctx.globalAlpha = 0.9;
  ctx.beginPath();
  const TH = 220; // threshold
  for (let y=1; y<h-1; y+=2) {
    for (let x=1; x<w-1; x+=2) {
      const i = y*w + x;
      if (edges[i] > TH) {
        ctx.moveTo(x, y);
        ctx.lineTo(x+0.5, y+0.5);
      }
    }
  }
  ctx.stroke();
  ctx.globalAlpha = 1;

  setStatus("Snapshot captured. (Demo highlight overlay drawn)");
}

/** Bind */
btnOpen.addEventListener("click", openCamera);
btnClose.addEventListener("click", closeCamera);
btnSnap.addEventListener("click", snapAndHighlight);

// Helpful console log
console.log("✅ App loaded. If nothing shows, check Console for errors.");
