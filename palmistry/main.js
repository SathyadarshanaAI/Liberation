/* ---------------------------------------------------------
   THE SEED · Palmistry AI
   main.js — Central Fusion Controller (v2.0)
   Entire Fusion System:
   - Camera Engine
   - International Language System
   - Frame Capture
   - Vision → Line Detect → Analysis
   - Render Output
   - User Form Trigger
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
const overlay = document.getElementById("handOverlay");
const outBox = document.getElementById("output");
const msg = document.getElementById("handMsg");
const languageSelect = document.getElementById("languageSelect");
const userForm = document.getElementById("userForm");

/* ---------------------------------------------------------
   LANGUAGE SYSTEM (12 Languages)
----------------------------------------------------------*/
const LANG = {
  en: {
    msg: "Place your hand inside the guide.",
    step: "First scan left hand, then right hand.",
    open: "Open Camera",
    scan: "Scan Hand"
  },
  si: {
    msg: "අත නිදර්ශකය ඇතුළට තබන්න.",
    step: "පළමුව වම් අත , පසුව දකුණු අත.",
    open: "කැමරා විවෘත කරන්න",
    scan: "අත් පරීක්ෂා කරන්න"
  },
  ta: {
    msg: "கையை வழிகாட்டி உள்ளே வையுங்கள்.",
    step: "முதல் இடது கை, பின்னர் வலது கை.",
    open: "கேமரா திறக்க",
    scan: "கை ஸ்கேன்"
  },
  hi: {
    msg: "हाथ को गाइड के अंदर रखें.",
    step: "पहले बायाँ, फिर दायाँ हाथ.",
    open: "कैमरा खोलें",
    scan: "हाथ स्कैन"
  },
  kn: {
    msg: "ಕೈಯನ್ನು ಮಾರ್ಗದರ್ಶಕದೊಳಗೆ ಇಡಿ.",
    step: "ಮೊದಲು ಎಡ ಕೈ, ನಂತರ ಬಲ ಕೈ.",
    open: "ಕ್ಯಾಮೆರಾ ಓಪನ್",
    scan: "ಕೈ ಸ್ಕ್ಯಾನ್"
  },
  bn: {
    msg: "হাত গাইডের ভিতরে রাখুন।",
    step: "বাম হাত → ডান হাত স্ক্যান।",
    open: "ক্যামেরা চালু করুন",
    scan: "হাত স্ক্যান"
  },
  ja: {
    msg: "手をガイドの中に置いてください。",
    step: "左手 → 右手をスキャン。",
    open: "カメラを開く",
    scan: "手をスキャン"
  }
};

/* Fill languages */
export function loadLanguages() {
  if (!languageSelect) return;
  Object.keys(LANG).forEach(l => {
    let opt = document.createElement("option");
    opt.value = l;
    opt.textContent = l.toUpperCase();
    languageSelect.appendChild(opt);
  });
}

loadLanguages();

/* Apply language */
export function setLanguage() {
  let L = languageSelect.value;
  if (!L) return;

  msg.innerHTML = LANG[L].msg + "<br>" + LANG[L].step;

  document.querySelectorAll(".actionBtn")[0].textContent = LANG[L].open;
  document.querySelectorAll(".actionBtn")[1].textContent = LANG[L].scan;
}

/* ---------------------------------------------------------
   CAMERA ENGINE
----------------------------------------------------------*/
export async function startCamera() {
  if (stream) stream.getTracks().forEach(t => t.stop());

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

  msg.innerHTML = "Hold your hand inside the guide.";
}

/* ---------------------------------------------------------
   CAPTURE + PROCESS
----------------------------------------------------------*/
export function captureHand() {

  if (!video.srcObject) {
    alert("Camera not active!");
    return;
  }

  msg.innerHTML = "Scanning hand… please wait.";

  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d").drawImage(video, 0, 0);

  const frame = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height);

  // 1. PALM DETECT
  const palm = detectPalm(frame);

  // 2. LINE DETECT
  const lines = detectLines(palm);

  // 3. SAVE INTO WISDOM CORE
  WisdomCore.setPalmistry("scan", { raw: frame, palm, lines });

  // 4. PALM ANALYSIS
  const palmReading = palmAnalysis(lines);

  // 5. KARMA ANALYSIS
  const karmaReading = karmaAnalysis(lines);

  // 6. MERGE TRUTH
  const finalReport = renderTruth(palmReading, karmaReading);

  // 7. DISPLAY
  outBox.textContent = finalReport;

  // 8. SHOW USER FORM
  showUserForm();

  msg.innerHTML = "Scan complete.";
}

/* ---------------------------------------------------------
   USER FORM
----------------------------------------------------------*/
export function showUserForm() {
  if (userForm) userForm.style.display = "block";
}

export function submitUserForm() {
  alert("User information saved.");
}
