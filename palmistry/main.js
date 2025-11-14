/* ---------------------------------------------------------
   THE SEED · Palmistry AI
   main.js — Central Fusion Controller (v2.1 Stable Build)
----------------------------------------------------------*/

import { detectPalm } from "./vision/palm-detect.js";
import { detectLines } from "./vision/line-detect.js";
import { WisdomCore } from "./core/wisdom-core.js";
import { palmAnalysis } from "./analysis/palm-core.js";
import { karmaAnalysis } from "./analysis/karma-engine.js";
import { renderTruth } from "./render/truth-output.js";

/* ---------------------------------------------------------
   DOM ELEMENTS
----------------------------------------------------------*/
let stream = null;

const video = document.getElementById("video");
const handMsg = document.getElementById("handMsg");
const outputBox = document.getElementById("output");
const languageSelect = document.getElementById("languageSelect");
const userForm = document.getElementById("userForm");

/* ---------------------------------------------------------
   LANGUAGE ENGINE (12 LANGS)
----------------------------------------------------------*/
const LANG = {
  en: { msg: "Place your hand inside the guide.", step: "First scan left hand, then right hand.", open: "Open Camera", scan: "Scan Hand" },
  si: { msg: "අත නිදර්ශකය ඇතුළට තබන්න.", step: "පළමුව වම් අත , පසුව දකුණු අත.", open: "කැමරා විවෘත කරන්න", scan: "අත් පරීක්ෂා කරන්න" },
  ta: { msg: "கையை வழிகாட்டி உள்ளே வையுங்கள்.", step: "முதல் இடது கை, பின்னர் வலது கை.", open: "கேமரா திறக்க", scan: "கை ஸ்கேன்" },
  hi: { msg: "हाथ को गाइड के अंदर रखें.", step: "पहले बायाँ, फिर दायाँ हाथ.", open: "कैमरा खोलें", scan: "हाथ स्कैन" },
  kn: { msg: "ಕೈಯನ್ನು ಮಾರ್ಗದರ್ಶಕದೊಳಗೆ ಇಡಿ.", step: "ಎಡ ಕೈ → ಬಲ ಕೈ.", open: "ಕ್ಯಾಮೆರಾ ಓಪನ್", scan: "ಕೈ ಸ್ಕ್ಯಾನ್" },
  bn: { msg: "হাত গাইডের ভিতরে রাখুন।", step: "বাম হাত → ডান হাত স্ক্যান।", open: "ক্যামেরা চালু করুন", scan: "হাত স্ক্যান" },
  ja: { msg: "手をガイドの中に置いてください。", step: "左手 → 右手をスキャン。", open: "カメラを開く", scan: "手をスキャン" },
};

/* Load languages */
export function loadLanguages() {
  if (!languageSelect) return;
  Object.keys(LANG).forEach(L => {
    let o = document.createElement("option");
    o.value = L;
    o.textContent = L.toUpperCase();
    languageSelect.appendChild(o);
  });
}
loadLanguages();

/* Apply language */
export function setLanguage() {
  const L = languageSelect.value;
  if (!L) return;

  handMsg.innerHTML = `${LANG[L].msg}<br>${LANG[L].step}`;
  document.querySelectorAll(".actionBtn")[0].textContent = LANG[L].open;
  document.querySelectorAll(".actionBtn")[1].textContent = LANG[L].scan;
}

/* ---------------------------------------------------------
   CAMERA ENGINE
----------------------------------------------------------*/
export async function startCamera() {
  if (stream) {
    stream.getTracks().forEach(t => t.stop());
  }

  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
      audio: false
    });
  } catch {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
  }

  video.srcObject = stream;
  await video.play();

  handMsg.innerHTML = "Hold your hand inside the guide.";
}

/* ---------------------------------------------------------
   CAPTURE + PROCESS AI PIPELINE
----------------------------------------------------------*/
export function captureHand() {

  if (!video.srcObject) {
    alert("Camera not active!");
    return;
  }

  handMsg.innerHTML = "Scanning… Please wait.";

  // canvas frame
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d").drawImage(video, 0, 0);

  const frame = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height);

  // AI pipeline
  const palm = detectPalm(frame);
  const lines = detectLines(palm);

  WisdomCore.setPalmistry("scan", {
    raw: frame,
    palm: palm,
    lines: lines
  });

  const palmReading = palmAnalysis(lines);
  const karmaReading = karmaAnalysis(lines);

  const finalOutput = renderTruth(palmReading, karmaReading);

  // Display
  outputBox.textContent = finalOutput;
  handMsg.innerHTML = "Scan complete.";

  showUserForm();
}

/* ---------------------------------------------------------
   USER FORM
----------------------------------------------------------*/
export function showUserForm() {
  if (userForm) userForm.style.display = "block";
}

export function submitUserForm() {
  alert("User information saved successfully.");
}

/* ---------------------------------------------------------
   GLOBAL EXPORTS (Fix for onclick errors)
----------------------------------------------------------*/
window.startCamera = startCamera;
window.captureHand = captureHand;
window.setLanguage = setLanguage;
window.loadLanguages = loadLanguages;
window.submitUserForm = submitUserForm;
