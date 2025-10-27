// --- Integrity monitor temporarily disabled to avoid duplicate conflicts ---
// import { checkModules, checkVersion } from "./modules/integrity-monitor.js";
// checkModules();
// checkVersion("v5.2");

import { startCamera, captureFrame } from "./modules/camera.js";
import { analyzeAI } from "./modules/ai-segmentation.js";
import { generateReport } from "./modules/report.js";
import { speak } from "./modules/voice.js";
import { compareHands } from "./modules/compare.js";
import { autoUpdate } from "./modules/updater.js";

// --- DOM elements ---
const L = { video: videoLeft, canvas: canvasLeft };
const R = { video: videoRight, canvas: canvasRight };
const msg = document.getElementById("msg");

// --- Camera controls ---
document.getElementById("startLeft").onclick = () => startCamera(L.video, msg);
document.getElementById("startRight").onclick = () => startCamera(R.video, msg);
document.getElementById("captureLeft").onclick = () => capture(L, "Left");
document.getElementById("captureRight").onclick = () => capture(R, "Right");

// --- Capture function ---
function capture(side, label) {
  const ctx = side.canvas.getContext("2d");
  side.canvas.width = side.video.videoWidth;
  side.canvas.height = side.video.videoHeight;
  ctx.drawImage(side.video, 0, 0, side.canvas.width, side.canvas.height);

  const data = side.canvas.toDataURL("image/png");
  localStorage.setItem(label === "Left" ? "palmLeft" : "palmRight", data);

  msg.textContent = `✅ ${label} hand captured successfully.`;
  console.log(`[${label}] Captured frame saved to memory.`);
}

// --- Analyze both hands ---
document.getElementById("analyzeBtn").onclick = async () => {
  try {
    msg.textContent = "🤖 Analyzing both hands...";
    const leftFrame = captureFrame(L.video);
    const rightFrame = captureFrame(R.video);

    const left = await analyzeAI(leftFrame);
    const right = await analyzeAI(rightFrame);

    await generateReport(left, "en", { hand: "Left" });
    await generateReport(right, "en", { hand: "Right" });

    const comparison = compareHands(left, right);
    speak(comparison.summary, "en");

    msg.textContent = "✅ Dual report generated successfully.";
    console.log("AI comparison:", comparison.summary);
    autoUpdate(); // Check for AI seed updates
  } catch (e) {
    msg.textContent = "❌ Error during analysis: " + e.message;
    console.error("Analyzer error:", e);
  }
};

// --- Safety log ---
window.addEventListener("error", (e) => {
  console.error("❌ JS Error:", e.message, e.filename, e.lineno);
});
window.addEventListener("unhandledrejection", (e) => {
  console.warn("⚠️ Promise Rejection:", e.reason);
});
