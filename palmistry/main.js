/* =========================================================
   THE SEED · Palmistry AI — main.js (v4.0 Stable)

   Systems Included:
   - Camera Engine
   - 14-Language System
   - Freeze Capture
   - Palm → Line → Reading Pipeline
   - Live AI Mode (Basic)
   - Export A4 (Placeholder until full build)
========================================================= */

// -----------------------------
// IMPORTS
// -----------------------------
import { detectPalm } from "./vision/palm-detect.js";
import { detectLines } from "./vision/line-detect.js";
import { finalReading } from "./render/truth-output.js";
import { renderPalm3D } from "./render/palm-3d-render.js";
import { buildA4Sheet } from "./render/a4-builder.js";
import { WisdomCore } from "./core/wisdom-core.js";

// -----------------------------
// DOM ELEMENTS
// -----------------------------
let stream = null;
const video     = document.getElementById("video");
const handMsg   = document.getElementById("handMsg");
const outputBox = document.getElementById("output");
const languageSelect = document.getElementById("languageSelect");

// -----------------------------
// LANGUAGE PACK (14 Languages)
// -----------------------------
const LANG = {
  en: { msg: "Place your hand inside the guide.", scan: "Scan Hand", open: "Open Camera" },
  si: { msg: "අත නිදර්ශකය ඇතුළට තබන්න.", scan: "අත පරීක්ෂා කරන්න", open: "කැමරාව විවෘත කරන්න" },
  ta: { msg: "கையை வழிகாட்டியுள் வையுங்கள்.", scan: "கையை ஸ்கேன் செய்", open: "கேமரா திறக்க" },
  hi: { msg: "हाथ को गाइड में रखें.", scan: "हथेली स्कैन करें", open: "कैमरा खोलें" },
  bn: { msg: "হাত গাইডের মধ্যে রাখুন।", scan: "হাত স্ক্যান করুন", open: "ক্যামেরা চালু করুন" },
  kn: { msg: "ಕೈಯನ್ನು ಗೈಡ್ ಒಳಗೆ ಇಡಿ.", scan: "ಕೈ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ", open: "ಕ್ಯಾಮೆರಾ ಓಪನ್ ಮಾಡಿ" },
  fr: { msg: "Placez votre main dans le guide.", scan: "Scanner la main", open: "Ouvrir la caméra" },
  de: { msg: "Hand in die Führung legen.", scan: "Hand scannen", open: "Kamera öffnen" },
  it: { msg: "Metti la mano nella guida.", scan: "Scansiona mano", open: "Apri fotocamera" },
  es: { msg: "Coloca tu mano dentro la guía.", scan: "Escanear mano", open: "Abrir cámara" },
  ru: { msg: "Поместите руку в рамку.", scan: "Сканировать руку", open: "Открыть камеру" },
  ro: { msg: "Pune mâna în ghidaj.", scan: "Scanează mâna", open: "Deschide camera" },
  pl: { msg: "Umieść dłoń w ramce.", scan: "Skanuj dłoń", open: "Otwórz kamerę" },
  he: { msg: "הנח את היד בתוך הסימון.", scan: "סרוק כף יד", open: "פתח מצלמה" }
};

// -----------------------------
// INIT LANGUAGE DROPDOWN
// -----------------------------
export function loadLanguages() {
  Object.keys(LANG).forEach(code => {
    const opt = document.createElement("option");
    opt.value = code;
    opt.textContent = code.toUpperCase();
    languageSelect.appendChild(opt);
  });
}

// -----------------------------
// APPLY LANGUAGE
// -----------------------------
export function setLanguage() {
  const L = languageSelect.value;
  if (!L) return;

  handMsg.textContent = LANG[L].msg;

  document.querySelectorAll(".actionBtn")[0].textContent = LANG[L].open;
  document.querySelectorAll(".actionBtn")[1].textContent = LANG[L].scan;
}

// -----------------------------
// CAMERA ENGINE
// -----------------------------
export async function startCamera() {
  handMsg.textContent = "Opening camera…";

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

  handMsg.textContent = "Place your hand inside the frame.";
}

// -----------------------------
// CAPTURE FREEZE
// -----------------------------
export function captureHand() {

  if (!video.srcObject) {
    outputBox.textContent = "⚠ Camera is not active!";
    return;
  }

  handMsg.textContent = "Capturing… hold still…";

  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0);

  const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);

  processPalm(frame);
}

// -----------------------------
// PALM → LINE → READING PIPELINE
// -----------------------------
async function processPalm(frame) {

  handMsg.textContent = "Detecting palm shape…";
  const palm = await detectPalm(frame);

  handMsg.textContent = "Reading palm lines…";
  const lines = await detectLines(palm);

  WisdomCore.saveScan({ palm, lines, raw: frame, timestamp: Date.now() });

  handMsg.textContent = "Generating reading…";
  const reading = finalReading(lines);

  outputBox.textContent = reading;

  renderPalm3D(lines);
  buildA4Sheet(lines);

  handMsg.textContent = "Scan complete ✔";
}

// -----------------------------
// LIVE AI MODE
// -----------------------------
export async function startLiveAI() {
  outputBox.textContent = "🎙 Listening…";

  const last = WisdomCore.getLastScan();
  if (!last) {
    outputBox.textContent = "⚠ No palm scan available!";
    return;
  }

  const reply = await WisdomCore.talk(last);
  outputBox.textContent = reply;
}

// -----------------------------
// EXPORT A4 (TEMP VERSION)
// -----------------------------
export function exportA4() {
  alert("📄 A4 export will be
