import { startCamera, captureFrame } from "./modules/camera.js";
import { checkClarity } from "./modules/clarity.js";
import { detectEdges } from "./modules/edges.js";
import { renderOverlay } from "./modules/overlay.js";
import { analyzeAI } from "./modules/ai-segmentation.js";
import { generateReport } from "./modules/report.js";
import { speak } from "./modules/voice.js";
import { validateEthics } from "./modules/ethics.js";

const video = document.getElementById("video");
const overlay = document.getElementById("overlay");
const msg = document.getElementById("msg");
let stream;

document.getElementById("startBtn").onclick = async () => {
  stream = await startCamera(video, msg);
};

document.getElementById("analyzeBtn").onclick = async () => {
  if (!stream) return (msg.textContent = "⚠️ Start camera first.");
  const frame = captureFrame(video);
  if (!(await validateEthics(frame, msg))) return;

  const clarity = checkClarity(frame);
  if (clarity < 0.4) {
    msg.textContent = "⚠️ Palm unclear. Retake under better light.";
    speak("Please move to brighter light.");
    return;
  }

  const edges = detectEdges(frame);
  renderOverlay(overlay, edges);
  msg.textContent = "✅ Palm lines detected. Running AI...";

  const result = await analyzeAI(edges);
  renderOverlay(overlay, edges, result);
  msg.textContent = "✅ AI segmentation done. Generating report...";

  // Auto-detect browser language (for multilingual translation)
  const userLang = navigator.language.slice(0, 2);

  await generateReport(result, userLang);
  speak(await translateTextAI("Palm analysis complete. " + result.summary, userLang), userLang);
};
