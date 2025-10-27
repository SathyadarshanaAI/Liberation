import { autoAnalyzeIfReady } from "./modules/ai-analyzer.js";
import { speak } from "./modules/voice.js";

// quick reference helpers
const $ = id => document.getElementById(id);
const L = { video: $("videoLeft"), canvas: $("canvasLeft") };
const R = { video: $("videoRight"), canvas: $("canvasRight") };
const msg = $("msg");

window.modulesLoaded = window.modulesLoaded || {};
window.modulesLoaded["main"] = true;

// ========== CAMERA ==========
async function startCam(side) {
  const v = side === "left" ? L.video : R.video;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" } // 🔁 back camera
    });
    v.srcObject = stream;
    bfLog(`📸 Camera started (${side})`);
  } catch (e) {
    bfLog(`❌ Camera error: ${e.message}`, "#ff4444");
    msg.textContent = "Camera permission error! Please allow camera access.";
    speak("කැමරා අයිතිය සක්‍රීය කරන්න.", "si");
  }
}

// ========== CAPTURE ==========
function capture(side) {
  const obj = side === "left" ? L : R;
  const ctx = obj.canvas.getContext("2d");
  obj.canvas.width = obj.video.videoWidth;
  obj.canvas.height = obj.video.videoHeight;
  ctx.drawImage(obj.video, 0, 0, obj.canvas.width, obj.canvas.height);

  const data = obj.canvas.toDataURL("image/png");
  localStorage.setItem(side === "left" ? "palmLeft" : "palmRight", data);

  bfLog(`✋ ${side} palm captured.`);
  msg.textContent = `${side === "left" ? "Left" : "Right"} hand locked ✅`;

  autoAnalyzeIfReady(msg); // trigger AI when both captured
}

// ========== UI HOOKS ==========
$("startLeft").onclick = () => startCam("left");
$("startRight").onclick = () => startCam("right");
$("captureLeft").onclick = () => capture("left");
$("captureRight").onclick = () => capture("right");

$("analyzeBtn").onclick = () => {
  bfLog("🔮 Manual analyze triggered.");
  autoAnalyzeIfReady(msg);
};

// ========== STATUS ==========
window.addEventListener("load", () => {
  bfLog("🕉️ Main module loaded successfully.");
  msg.textContent = "System ready. Awaiting capture...";
});

// ========== DEBUG SAFETY ==========
window.onerror = (m, s, l) => bfLog(`❌ ${m} in ${s?.split("/").pop() || "?"}@${l}`, "#ff5555");
window.addEventListener("unhandledrejection", e =>
  bfLog(`⚠️ ${e.reason?.message || e.reason}`, "#ffaa33")
);
