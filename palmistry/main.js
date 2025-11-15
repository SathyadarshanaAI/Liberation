/* ---------------------------------------------------------
   THE SEED · Palmistry AI
   main.js — Central Fusion Controller (v3.0)
   Systems:
   - Camera Engine
   - Freeze Capture
   - Palm Detect → Line Detect Pipeline
   - A4 Builder Trigger
   - 3D Render Trigger
   - Live AI Mode Trigger
----------------------------------------------------------*/

import { detectPalm } from "./vision/palm-detect.js";
import { detectLines } from "./vision/line-detect.js";
import { buildA4Sheet } from "./render/a4-builder.js";
import { renderPalm3D } from "./render/palm-3d-render.js";
import { finalReading } from "./render/truth-output.js";
import { WisdomCore } from "./core/wisdom-core.js";

let stream = null;
const video     = document.getElementById("video");
const handMsg   = document.getElementById("handMsg");
const outputBox = document.getElementById("output");

/* =========================================================
   CAMERA ENGINE
========================================================= */
export async function startCamera() {
    handMsg.innerHTML = "Opening camera…";

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

    handMsg.innerHTML = "Place your hand inside the frame.";
}

/* =========================================================
   CAPTURE FREEZE
========================================================= */
export function captureHand() {
    if (!video.srcObject) {
        alert("Camera is not active!");
        return;
    }

    handMsg.innerHTML = "Capturing… hold still…";

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);
    
    const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);

    processPalm(frame);
}

/* =========================================================
   PROCESS PIPELINE
========================================================= */
async function processPalm(frame) {

    handMsg.innerHTML = "Detecting palm shape…";

    const palm = await detectPalm(frame);

    handMsg.innerHTML = "Reading palm lines…";

    const lines = await detectLines(palm);

    WisdomCore.saveScan({
        raw: frame,
        palm,
        lines,
        timestamp: Date.now()
    });

    handMsg.innerHTML = "Generating reading…";

    const reading = finalReading(lines);

    outputBox.textContent = reading;

    handMsg.innerHTML = "Scan complete ✔ Your report is ready.";

    // auto-trigger 3D + A4 build
    renderPalm3D(lines);
    buildA4Sheet(lines);
}

/* =========================================================
   LIVE AI MODE
========================================================= */
export async function startLiveAI() {
    outputBox.textContent = "🎙 Listening… Ask about your palm lines.";

    const last = WisdomCore.getLastScan();

    if (!last) {
        outputBox.textContent = "No palm scan data available!";
        return;
    }

    const answer = await WisdomCore.talk(last);
    outputBox.textContent = answer;
}
