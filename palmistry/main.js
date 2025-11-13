/* ---------------------------------------------------------
   THE SEED · Palmistry AI
   main.js — Central Fusion Controller (v1.0)
   Controls:
   - Camera Engine
   - Frame Capture
   - Vision → Line Detect → Analysis
   - Render Output
----------------------------------------------------------*/

import { detectPalm } from "./vision/palm-detect.js";
import { detectLines } from "./vision/line-detect.js";
import { WisdomCore } from "./core/wisdom-core.js";
import { palmAnalysis } from "./analysis/palm-core.js";
import { karmaAnalysis } from "./analysis/karma-engine.js";
import { renderTruth } from "./render/truth-output.js";

let stream = null;
const video = document.getElementById("video");
const overlay = document.getElementById("handOverlay");
const outBox = document.getElementById("output");
const msg = document.getElementById("handMsg");

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

  msg.innerHTML = "Hold your hand inside the guide and keep steady.";
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

  // CREATE FRAME CANVAS
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d").drawImage(video, 0, 0);

  // IMAGE DATA
  const frame = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height);

  /* ---------------------------------------------------------
     PROCESS PIPELINE
  ----------------------------------------------------------*/

  // 1. PALM DETECT
  const palm = detectPalm(frame);

  // 2. LINE DETECT (8-line engine)
  const lines = detectLines(palm);

  // 3. STORE in WISDOM CORE
  WisdomCore.setPalmistry("scan", {
    raw: frame,
    palm,
    lines
  });

  // 4. PALM ANALYSIS
  const palmReading = palmAnalysis(lines);

  // 5. KARMA / SPIRITUAL ANALYSIS
  const karmaReading = karmaAnalysis(lines);

  // 6. MERGE FINAL TRUTH
  const finalReport = renderTruth(palmReading, karmaReading);

  // 7. SHOW OUTPUT
  outBox.textContent = finalReport;

  msg.innerHTML = "Hand scanned successfully. View your reading below.";
}
