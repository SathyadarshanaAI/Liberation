/* ================================================================
   🕉️ THE SEED · Palmistry AI · V230.7 (STABLE)
   MAIN.JS — AI Box + Hand Mask + Freeze Capture + Analyzer
================================================================ */

import { applyHandMask } from "./hand-mask-engine.js";
import { analyzePalm } from "./palm-engine-v230.js";

let video, palmCanvas, overlayCanvas, outputBox, debugBox;
let palmCtx, overlayCtx;

let hands = null;
let lastAIBox = null;
let running = false;

/* ------------------------------------------------------------
   INIT DOM REFERENCES
------------------------------------------------------------- */
function initRefs() {
    video = document.getElementById("video");
    palmCanvas = document.getElementById("palmCanvas");
    overlayCanvas = document.getElementById("overlayCanvas");
    outputBox = document.getElementById("output");
    debugBox = document.getElementById("debugConsole");

    palmCtx = palmCanvas.getContext("2d");
    overlayCtx = overlayCanvas.getContext("2d");
}

/* ------------------------------------------------------------
   AUTO RESIZE OVERLAY
------------------------------------------------------------- */
function syncOverlaySize() {
    const box = document.getElementById("palmPreviewBox");
    overlayCanvas.width = box.clientWidth;
    overlayCanvas.height = box.clientWidth * 1.333;
}

/* ------------------------------------------------------------
   LOAD MEDIAPIPE HANDS
------------------------------------------------------------- */
async function loadHands() {
    try {
        log("Loading MediaPipe AI…");

        await import("https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js");
        await import("https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js");
        await import("https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js");

        const MPHands = window.Hands;

        hands = new MPHands({
            locateFile: (f) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}`
        });

        hands.setOptions({
            maxNumHands: 1,
            modelComplexity: 1,
            minDetectionConfidence: 0.65,
            minTrackingConfidence: 0.65
        });

        hands.onResults(onAIResults);

        log("AI Model Ready ✔");

    } catch (e) {
        error("AI Load Failed: " + e);
    }
}
loadHands();

/* ------------------------------------------------------------
   START CAMERA
------------------------------------------------------------- */
export async function startCamera() {
    initRefs();

    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" }
        });

        video.srcObject = stream;

        running = true;
        aiLoop();

        log("Camera started ✔");

    } catch (e) {
        error("Camera Error: " + e);
    }
}

/* ------------------------------------------------------------
   AI LOOP
------------------------------------------------------------- */
async function aiLoop() {
    if (!running) return;

    if (hands && video.videoWidth > 0) {
        await hands.send({ image: video });
    }

    requestAnimationFrame(aiLoop);
}

/* ------------------------------------------------------------
   WHEN AI DETECTS HAND
------------------------------------------------------------- */
function onAIResults(results) {

    syncOverlaySize();

    overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

    if (!results?.multiHandLandmarks?.length) {
        lastAIBox = null;
        return;
    }

    const pts = results.multiHandLandmarks[0];

    const xs = pts.map(p => p.x * overlayCanvas.width);
    const ys = pts.map(p => p.y * overlayCanvas.height);

    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    lastAIBox = {
        minX,
        minY,
        width: maxX - minX,
        height: maxY - minY
    };

    overlayCtx.strokeStyle = "#00eaff";
    overlayCtx.lineWidth = 3;
    overlayCtx.strokeRect(minX, minY, lastAIBox.width, lastAIBox.height);

    log("AI box updated ✔");
}

/* ------------------------------------------------------------
   CAPTURE HAND
------------------------------------------------------------- */
export function captureHand() {
    initRefs();

    const preview = document.getElementById("palmPreviewBox");
    preview.style.display = "block";

    palmCanvas.width = overlayCanvas.width;
    palmCanvas.height = overlayCanvas.height;

    palmCtx.drawImage(video, 0, 0, palmCanvas.width, palmCanvas.height);

    // Redraw AI Box
    if (lastAIBox) {
        overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
        overlayCtx.strokeStyle = "#00eaff";
        overlayCtx.lineWidth = 3;
        overlayCtx.strokeRect(lastAIBox.minX, lastAIBox.minY, lastAIBox.width, lastAIBox.height);
    }

    log("Frame frozen ✔");

    // APPLY HAND MASK
    if (lastAIBox) {
        const leftMask = document.getElementById("handMaskLeft");
        const rightMask = document.getElementById("handMaskRight");
        const selectedHand = document.getElementById("handPref").value;

        applyHandMask(palmCtx, lastAIBox, leftMask, rightMask, selectedHand);
        log("Mask applied ✔");
    }

    // ANALYZE PALM
    const pixels = palmCtx.getImageData(0, 0, palmCanvas.width, palmCanvas.height);
    const selectedHand = document.getElementById("handPref").value;

    const analysis = analyzePalm(pixels, selectedHand);

    outputBox.textContent =
        "🧠 Sathyadarshana Mini Report – V240\n\n" +
        analysis.miniReport;

    log("AI analysis completed ✔");
}

/* ------------------------------------------------------------
   DEBUG
------------------------------------------------------------- */
function log(msg) {
    debugBox.textContent += "✔ " + msg + "\n";
}
function error(msg) {
    debugBox.textContent += "🔥 " + msg + "\n";
}

/* ------------------------------------------------------------
   EXPORT
------------------------------------------------------------- */
window.startCamera = startCamera;
window.captureHand = captureHand;

export default { startCamera, captureHand };
