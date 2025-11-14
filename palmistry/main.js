/* ---------------------------------------------------------
   THE SEED · Palmistry AI
   main.js — Central Fusion Controller (FINAL v3.0)
----------------------------------------------------------*/

import { detectPalm } from "./vision/palm-detect.js";
import { detectLines } from "./vision/line-detect.js";
import { WisdomCore } from "./core/wisdom-core.js";
import { palmAnalysis } from "./analysis/palm-core.js";
import { karmaAnalysis } from "./analysis/karma-engine.js";
import { renderTruth } from "./render/truth-output.js";
import { LANG, loadLanguages, applyLanguage } from "./languages/lang-engine.js";

/* DOM Elements */
let stream = null;
const video = document.getElementById("video");
const msg = document.getElementById("handMsg");
const outBox = document.getElementById("output");
const languageSelect = document.getElementById("languageSelect");
const userForm = document.getElementById("userForm");

/* Load language list */
loadLanguages(languageSelect);

/* When language changes */
languageSelect.addEventListener("change", () => {
  applyLanguage(languageSelect.value, msg);
});

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
  } catch (err) {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
  }

  video.srcObject = stream;
  await video.play();
  msg.textContent = "Hold your hand steady inside the guide.";
}

/* ---------------------------------------------------------
   CAPTURE & PROCESS
----------------------------------------------------------*/
export function captureHand() {
  if (!video.srcObject) {
    alert("Camera is not active!");
    return;
  }

  msg.textContent = "Scanning hand…";

  /* FRAME CAPTURE */
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d").drawImage(video, 0, 0);

  const frame = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height);

  /* PIPELINE */
  const palmData = detectPalm(frame);
  const lines = detectLines(palmData);

  WisdomCore.setPalmistry("scan", { frame, palmData, lines });

  const palmReading = palmAnalysis(lines);
  const karmaReading = karmaAnalysis(lines);
  const finalReport = renderTruth(palmReading, karmaReading);

  outBox.textContent = finalReport;
  msg.textContent = "Scan complete.";

  showUserForm();
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
