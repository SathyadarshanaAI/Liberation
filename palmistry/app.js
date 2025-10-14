// app.js
const $ = (s, r=document) => r.querySelector(s);

$("#app").innerHTML = `
  <h1 style="color:#00e5ff;margin:14px 0 6px">Quantum Palm Analyzer v4.6</h1>
  <p id="status" style="opacity:.9;margin:0 0 10px">Ready</p>

  <div style="display:grid;gap:10px;place-items:center">
    <video id="video" playsinline autoplay muted
      style="width:92vw;max-width:420px;border-radius:16px;border:2px solid #16f0a7;background:#000"></video>
    <canvas id="overlay"
      style="width:92vw;max-width:420px;border-radius:16px;display:none"></canvas>

    <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center">
      <button id="open"  style="padding:10px 14px;border-radius:12px;border:1px solid #00e5ff;background:#0b0f16;color:#00e5ff;font-weight:600">Open Camera</button>
      <button id="snap"  style="padding:10px 14px;border-radius:12px;border:1px solid #16f0a7;background:#0b0f16;color:#16f0a7;font-weight:600" disabled>Snap</button>
      <button id="close" style="padding:10px 14px;border-radius:12px;border:1px solid #444;background:#0b0f16;color:#ddd" disabled>Close</button>
    </div>
  </div>
`;

const statusEl = $("#status");
const video = $("#video");
const overlay = $("#overlay");
const btnOpen = $("#open");
const btnSnap = $("#snap");
const btnClose = $("#close");
let stream;

const setStatus = (t) => (statusEl.textContent = t);
const secureOK = () =>
  location.protocol === "https:" || ["localhost","127.0.0.1"].includes(location.hostname);

async function openCamera() {
  if (!secureOK()) {
    setStatus("Camera requires HTTPS or localhost.");
    alert("Run on HTTPS (Pages/Cloudflare) or localhost.");
    return;
  }
  try {
    setStatus("Requesting camera…");
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
      audio: false
    });
    video.srcObject = stream;
    await video.play();
    btnSnap.disabled = false;
    setTimeout(()=> btnClose.disabled = false, 300);
    setStatus("Camera ON. Hold your palm steady.");
  } catch (e) {
    console.warn(e);
    setStatus("Camera error: " + (e.message||e));
  }
}

function closeCamera() {
  if (stream) { stream.getTracks().forEach(t=>t.stop()); stream=null; }
  video.srcObject = null;
  btnSnap.disabled = true;
  btnClose.disabled = true;
  setStatus("Camera OFF.");
}

function snapAndHighlight() {
  if (!video.videoWidth) { setStatus("Waiting for video…"); return; }
  overlay.width = video.videoWidth;
  overlay.height = video.videoHeight;
  overlay.style.display = "block";
  const ctx = overlay.getContext("2d");
  ctx.drawImage(video, 0, 0, overlay.width, overlay.height);

  // simple edge-ish glow (demo placeholder for real analyzer)
  const img = ctx.getImageData(0,0,overlay.width,overlay.height);
  const d = img.data, w = overlay.width, h = overlay.height;
  const l = new Uint8ClampedArray(w*h);
  for (let i=0,p=0;i<d.length;i+=4,p++) l[p]=(d[i]*.2126+d[i+1]*.7152+d[i+2]*.0722)|0;
  const edges = new Uint8ClampedArray(w*h);
  for (let y=1;y<h-1;y++){
    for (let x=1;x<w-1;x++){
      const i=y*w+x;
      const gx=l[i+1]-l[i-1], gy=l[i+w]-l[i-w];
      edges[i]=Math.min(255,Math.abs(gx)+Math.abs(gy));
    }
  }
  ctx.lineWidth=1.4; ctx.strokeStyle="#00e5ff"; ctx.globalAlpha=.9; ctx.beginPath();
  const TH=220;
  for (let y=1;y<h-1;y+=2){ for (let x=1;x<w-1;x+=2){
    const i=y*w+x; if (edges[i]>TH){ ctx.moveTo(x,y); ctx.lineTo(x+.5,y+.5); }
  }}
  ctx.stroke(); ctx.globalAlpha=1;
  setStatus("Snapshot captured (demo overlay).");
}

btnOpen.onclick = openCamera;
btnClose.onclick = closeCamera;
btnSnap.onclick = snapAndHighlight;

console.log("✅ App loaded");
