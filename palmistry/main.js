// =============================
// 🧠 SATHYADARSHANA · QUANTUM PALM ANALYZER
// MAIN ENGINE + INTEGRITY GUARDIAN v3.9 CONNECTED
// =============================

// --- Imports ---
import { startCamera, captureFrame } from "./modules/camera.js";
import { checkClarity } from "./modules/clarity.js";
import { detectEdges } from "./modules/edges.js";
import { renderOverlay } from "./modules/overlay.js";
import { analyzeAI } from "./modules/ai-segmentation.js";
import { generateReport } from "./modules/report.js";
import { speak } from "./modules/voice.js";
import { validateEthics } from "./modules/ethics.js";
import { getUserData } from "./modules/form.js";
import { translateTextAI } from "./modules/translate.js";

// 🧩 Integrity Guardian Module
import {
  checkModules,
  checkVersion,
  trackPalm
} from "./modules/integrity-monitor.js";

// --- Initialize Integrity System ---
checkModules();
checkVersion("v3.9");

// --- DOM Elements ---
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const overlay = document.getElementById("overlay");
const msg = document.getElementById("msg");

let stream = null;

// --- Start Camera ---
document.getElementById("startBtn").onclick = async () => {
  msg.textContent = "🟡 Initializing camera...";
  stream = await startCamera(video, msg);
  if (stream) {
    msg.textContent = "✅ Camera active. Place hand under bright light.";
  }
};

// --- Capture Palm ---
document.getElementById("captureBtn").onclick = () => {
  if (!video.srcObject) {
    msg.textContent = "⚠️ Please start camera first.";
    msg.className = "error";
    return;
  }

  const ctx = canvas.getContext("2d");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  msg.textContent = "✅ Palm captured successfully! Ready for AI analysis.";
  msg.className = "";

  // Save to memory + Integrity ID log
  localStorage.setItem("lastPalm", canvas.toDataURL("image/png"));
  trackPalm("unknown"); // Auto log with unique Palm ID
};

// --- Analyze Palm via AI ---
document.getElementById("analyzeBtn").onclick = async () => {
  if (!stream) {
    msg.textContent = "⚠️ Start camera first.";
    msg.className = "error";
    return;
  }

  const frame = captureFrame(video);
  if (!(await validateEthics(frame, msg))) return;

  // --- Clarity detection ---
  const clarity = checkClarity(frame);
  if (clarity < 0.35) {
    msg.textContent = "⚠️ Palm unclear. Please recapture in brighter light.";
    speak("Please move to brighter light.");
    return;
  }

  // --- Edge detection & overlay ---
  msg.textContent = "🔍 Detecting palm lines...";
  const edges = detectEdges(frame);
  renderOverlay(overlay, edges);

  // --- AI segmentation ---
  msg.textContent = "🤖 Analyzing palm structure...";
  const result = await analyzeAI(edges);
  renderOverlay(overlay, edges, result);

  // --- Fetch user data ---
  const user = getUserData();

  // --- Multilingual translation ---
  const userLang = navigator.language.slice(0, 2);

  // --- Generate report ---
  msg.textContent = "📄 Generating AI report...";
  await generateReport(result, userLang, user);

  // --- Voice summary ---
  const summaryText = await translateTextAI(
    "Palm analysis complete for " + user.name + ". " + result.summary,
    userLang
  );
  speak(summaryText, userLang);

  msg.textContent = "✅ Report ready for " + user.name + ".";
};
