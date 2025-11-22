/* ================================================================
   🕉️ THE SEED · Palmistry AI · V240
   MAIN.JS — AI Box + Hand Mask + ROI Crop + Analyzer
================================================================ */

import { analyzePalm } from "./palm-engine-v230.js";
import { applyHandMask, extractPalmROI } from "./hand-mask-engine.js";

let video, palmCanvas, overlayCanvas;
let palmCtx, overlayCtx;

let outputBox, debugBox;

let hands = null;
let lastAIBox = null;
let running = false;

/* INIT REFERENCES ------------------------------------------------ */
function initRefs() {
    video = document.getElementById("video");
    palmCanvas = document.getElementById("palmCanvas");
    overlayCanvas = document.getElementById("overlayCanvas");

    outputBox = document.getElementById("output");
    debugBox = document.getElementById("debugConsole");

    palmCtx = palmCanvas.getContext("2d");
    overlayCtx = overlayCanvas.getContext("2d");
}

/* AUTO RESIZE OVERLAY ------------------------------------------ */
function syncOverlaySize() {
    const box = document.getElementById("palmPreviewBox");
    overlayCanvas.width = box.clientWidth;
    overlayCanvas.height = box.clientWidth * 1.333;
}

/* LOAD MEDIAPIPE ------------------------------------------------ */
async function loadHands() {
    try {
        log("Loading MediaPipe AI…");

        await import("https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js");

        const MPHands = window.Hands;

        hands = new MPHands({
            locateFile: f => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}`
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

/* START CAMERA ------------------------------------------------- */
export async function startCamera() {
    initRefs();

    const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
    });

    video.srcObject = stream;
    running = true;
    aiLoop();

    log("Camera started ✔");
}

/* AI LOOP ------------------------------------------------------ */
async function aiLoop() {
    if (!running) return;

    if (hands && video.videoWidth > 0) {
        await hands.send({ image: video });
    }

    requestAnimationFrame(aiLoop);
}

/* WHEN AI DETECTS HAND ---------------------------------------- */
function onAIResults(results) {

    syncOverlaySize();
    overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

    if (!results.multiHandLandmarks?.length) {
        lastAIBox = null;
        return;
    }

    const pts = results.multiHandLandmarks[0];

    const xs = pts.map(p => p.x * overlayCanvas.width);
    const ys = pts.map(p => p.y * overlayCanvas.height);

    lastAIBox = {
        minX: Math.min(...xs),
        minY: Math.min(...ys),
        width: Math.max(...xs) - Math.min(...xs),
        height: Math.max(...ys) - Math.min(...ys)
    };

    // Mask preview
    const maskImg = document.getElementById("handMaskLeft");  
    applyHandMask(overlayCtx, maskImg, lastAIBox);

    log("AI box + Mask updated ✔");
}

/* CAPTURE HAND ------------------------------------------------ */
export function captureHand() {
    initRefs();

    document.getElementById("palmPreviewBox").style.display = "block";

    palmCanvas.width = overlayCanvas.width;
    palmCanvas.height = overlayCanvas.height;

    palmCtx.drawImage(video, 0, 0, palmCanvas.width, palmCanvas.height);

    // Extract ROI
    const fullPixels = palmCtx.getImageData(
        0, 0, palmCanvas.width, palmCanvas.height
    );

    const roiCanvas = extractPalmROI(fullPixels, lastAIBox);

    const selectedHand = document.getElementById("handPref").value;

    const analysis = analyzePalm(
        roiCanvas.getContext("2d").getImageData(
            0, 0, roiCanvas.width, roiCanvas.height
        ),
        selectedHand
    );

    outputBox.textContent =
        "🧠 Sathyadarshana Mini Report – V240\n\n" +
        analysis.miniReport;

    log("Frame captured + ROI + analysis ✔");
}

/* DEBUG ------------------------------------------------------- */
function log(msg) { debugBox.textContent += "✔ " + msg + "\n"; }
function error(msg) { debugBox.textContent += "🔥 " + msg + "\n"; }

window.startCamera = startCamera;
window.captureHand = captureHand;
export default { startCamera, captureHand };
