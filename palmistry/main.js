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

const video = document.getElementById("video");
const overlay = document.getElementById("overlay");
const msg = document.getElementById("msg");
let stream;

document.getElementById("startBtn").onclick = async () => {
  stream = await startCamera(video, msg);
};

document.getElementById("analyzeBtn").onclick = async () => {
  if (!stream) {
    msg.textContent = "⚠️ Start camera first.";
    msg.className = "error";
    return;
  }

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

  // Get user data (Name, DOB, Gender, ID)
  const user = getUserData();

  // Auto-detect browser language for multilingual translation
  const userLang = navigator.language.slice(0, 2);

  // Generate multilingual + personalized report
  await generateReport(result, userLang, user);

  // Voice summary in same language
  const spoken = await translateTextAI("Palm analysis complete for " + user.name + ". " + result.summary, userLang);
  speak(spoken, userLang);

  msg.textContent = "✅ Report ready for " + user.name + ".";
};
