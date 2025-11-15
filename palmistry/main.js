/* =========================================================
   THE SEED · Palmistry AI (Stable v5.0)
========================================================= */

import { detectPalm } from "./vision/palm-detect.js";
import { detectLines } from "./vision/line-detect.js";
import { WisdomCore } from "./core/wisdom-core.js";

// UI elements
let stream = null;
const video = document.getElementById("video");
const handMsg = document.getElementById("handMsg");
const outputBox = document.getElementById("output");
const debugConsole = document.getElementById("debugConsole");
const languageSelect = document.getElementById("languageSelect");

// -----------------------------
// LANGUAGE SYSTEM
// -----------------------------
const LANG = {
  en: { msg: "Place your hand inside the frame.", open: "Open Camera", scan: "Scan Hand" },
  si: { msg: "අත නිරූපණයට ඇතුළත තබන්න.", open: "කැමරා විවෘත කරන්න", scan: "අත පරීක්ෂා කරන්න" },
  ta: { msg: "கையை வழிகாட்டியுள் வையுங்கள்.", open: "கேமரா திறக்க", scan: "கை ஸ்கேன் செய்" }
};

export function loadLanguages() {
  Object.keys(LANG).forEach(code => {
    const o = document.createElement("option");
    o.value = code;
    o.textContent = code.toUpperCase();
    languageSelect.appendChild(o);
  });
}

export function setLanguage() {
  const L = LANG[languageSelect.value];
  if (!L) return;

  handMsg.textContent = L.msg;

  document.querySelectorAll(".actionBtn")[0].textContent = L.open;
  document.querySelectorAll(".actionBtn")[1].textContent = L.scan;
}

// -----------------------------
// DEBUG LOGGER
// -----------------------------
function log(msg) {
  debugConsole.textContent += "\n" + msg;
}

// -----------------------------
// CAMERA ENGINE
// -----------------------------
export async function startCamera() {
  log("Opening camera…");

  if (stream) stream.getTracks().forEach(t => t.stop());

  stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: "environment" }
  });

  video.srcObject = stream;
  await video.play();

  handMsg.textContent = "Place your hand inside the frame.";
  log("Camera started.");
}

// -----------------------------
// CAPTURE FREEZE
// -----------------------------
export function captureHand() {
  if (!video.srcObject) return;

  log("Capturing frame…");

  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0);

  processPalm(canvas);
}

// -----------------------------
// PROCESS PALM
// -----------------------------
async function processPalm(canvas) {

  log("Detecting palm…");

  const palmCanvas = await detectPalm(canvas);
  if (!palmCanvas) {
    log("Palm detection failed!");
    return;
  }

  // Show preview
  const previewBox = document.getElementById("palmPreviewBox");
  const preview = document.getElementById("palmPreview");

  previewBox.style.display = "block";
  preview.width = palmCanvas.width;
  preview.height = palmCanvas.height;
  preview.getContext("2d").drawImage(palmCanvas, 0, 0);

  log("Palm preview rendered.");

  handMsg.textContent = "Reading lines…";

  const lines = await detectLines(palmCanvas);

  outputBox.textContent = "Palm captured ✔\nLine count: " + (lines?.length || 0);
  log("Lines detected.");
}

// -----------------------------
// LIVE AI (temp)
// -----------------------------
export function startLiveAI() {
  alert("Live AI mode coming soon.");
}

// -----------------------------
// EXPORT A4
// -----------------------------
export function exportA4() {
  alert("A4 Export coming soon.");
}
