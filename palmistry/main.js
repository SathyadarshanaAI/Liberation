// 🕉️ Sathyadarshana Quantum Palm Analyzer V3.3 — Secure Lock Edition
// Author: Anurudda Dilip & Buddhi AI
// Purpose: Dual-hand camera capture, lock system, monitor-integrated error logging

// --- Global module registry for Fusion Monitor ---
window.modulesLoaded = { main: true };

// --- Utility selectors ---
const $ = id => document.getElementById(id);
const msg = $("msg");

// --- Camera setup objects ---
const L = { video: $("videoLeft"), canvas: $("canvasLeft"), name: "Left" };
const R = { video: $("videoRight"), canvas: $("canvasRight"), name: "Right" };

// --- Camera starter ---
async function startCamera(video, side) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
    });
    video.srcObject = stream;
    msg.textContent = `✅ ${side} camera started.`;
    window.modulesLoaded[side + "_cam"] = true;
    document.dispatchEvent(
      new CustomEvent("buddhi-log", {
        detail: { message: `${side} camera started successfully.` },
      })
    );
  } catch (err) {
    msg.textContent = `❌ ${side} camera error: ${err.message}`;
    document.dispatchEvent(
      new CustomEvent("buddhi-error", {
        detail: {
          file: "camera.js",
          line: 15,
          message: err.message,
        },
      })
    );
  }
}

// --- Capture frame helper ---
function captureFrame(video) {
  const c = document.createElement("canvas");
  c.width = video.videoWidth || 640;
  c.height = video.videoHeight || 480;
  const ctx = c.getContext("2d");
  ctx.drawImage(video, 0, 0, c.width, c.height);
  return c;
}

// --- Capture lock ---
function capture(sideObj) {
  try {
    const v = sideObj.video,
      c = sideObj.canvas;
    if (!v.srcObject) throw new Error(`${sideObj.name} camera not active`);
    c.width = v.videoWidth;
    c.height = v.videoHeight;
    const ctx = c.getContext("2d");
    ctx.drawImage(v, 0, 0, c.width, c.height);
    const data = c.toDataURL("image/png");
    localStorage.setItem("palm" + sideObj.name, data);

    // visual lock
    c.hidden = false;
    flash(c);

    msg.textContent = `📸 ${sideObj.name} hand locked 🔒`;
    document.dispatchEvent(
      new CustomEvent("buddhi-log", {
        detail: { message: `${sideObj.name} hand captured successfully.` },
      })
    );
  } catch (e) {
    msg.textContent = "❌ " + e.message;
    document.dispatchEvent(
      new CustomEvent("buddhi-error", {
        detail: {
          file: "main.js",
          line: 41,
          message: e.message,
        },
      })
    );
  }
}

// --- Flash animation on lock ---
function flash(el) {
  el.style.boxShadow = "0 0 20px #16f0a7";
  setTimeout(() => (el.style.boxShadow = "none"), 600);
}

// --- Analyze logic ---
function analyzeBoth() {
  msg.textContent = "🔮 Analyzing both hands...";
  try {
    const left = localStorage.getItem("palmLeft");
    const right = localStorage.getItem("palmRight");
    if (!left || !right)
      throw new Error("Both hands not captured yet — please capture first.");

    msg.textContent = "✅ Both hands ready for AI analysis.";
    document.dispatchEvent(
      new CustomEvent("buddhi-log", {
        detail: { message: "Dual capture verified, AI sync initialized." },
      })
    );

    // Simulated AI processing placeholder
    setTimeout(() => {
      msg.textContent = "🧠 AI analysis complete (simulation mode).";
      document.dispatchEvent(
        new CustomEvent("buddhi-log", {
          detail: { message: "AI analyzer simulation complete (success)." },
        })
      );
    }, 2000);
  } catch (e) {
    msg.textContent = "❌ " + e.message;
    document.dispatchEvent(
      new CustomEvent("buddhi-error", {
        detail: {
          file: "main.js",
          line: 74,
          message: e.message,
        },
      })
    );
  }
}

// --- Button actions ---
$("startLeft").onclick = () => startCamera(L.video, "Left");
$("startRight").onclick = () => startCamera(R.video, "Right");
$("captureLeft").onclick = () => capture(L);
$("captureRight").onclick = () => capture(R);
$("analyzeBtn").onclick = analyzeBoth;

// --- Status reporting to Fusion Monitor ---
window.addEventListener("load", () => {
  document.dispatchEvent(
    new CustomEvent("buddhi-log", {
      detail: { message: "Main.js fully loaded and active." },
    })
  );
  msg.textContent = "🧩 System initialized successfully.";
});
