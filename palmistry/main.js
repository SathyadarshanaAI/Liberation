/* ================================================================
   🕉️ THE SEED · Palmistry AI · V230-AI BOX
   MAIN.JS — Camera + MediaPipe AI + Freeze Capture + Analyzer
   ================================================================ */

import { analyzePalm } from "./palm-engine-v230.js";

let video, palmCanvas, overlayCanvas, outputBox, debugBox;
let palmCtx, overlayCtx;

let hands = null;           // MediaPipe Hands model
let lastAIBox = null;       // Save AI box on freeze
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
   START CAMERA + AI LOOP
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
        error("Camera error: " + e);
    }
}

/* ------------------------------------------------------------
   AI DETECTION LOOP
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
    overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

    if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
        lastAIBox = null;
        return;
    }

    const pts = results.multiHandLandmarks[0];

    // Convert 0–1 coords into pixels
    const xs = pts.map(p => p.x * overlayCanvas.width);
    const ys = pts.map(p => p.y * overlayCanvas.height);

    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    lastAIBox = { minX, minY, width: maxX - minX, height: maxY - minY };

    // Draw AI box
    overlayCtx.strokeStyle = "#ffd700";
    overlayCtx.lineWidth = 3;
    overlayCtx.strokeRect(minX, minY, maxX - minX, maxY - minY);

    log("AI box updated ✔");
}

/* ------------------------------------------------------------
   CAPTURE HAND (FREEZE)
------------------------------------------------------------- */
export function captureHand() {
    initRefs();

    // Show preview box
    document.getElementById("palmPreviewBox").style.display = "block";

    // Resize canvases
    palmCanvas.width = video.videoWidth;
    palmCanvas.height = video.videoHeight;

    overlayCanvas.width = video.videoWidth;
    overlayCanvas.height = video.videoHeight;

    // Draw current frame
    palmCtx.drawImage(video, 0, 0, palmCanvas.width, palmCanvas.height);

    // Redraw last AI box on frozen image
    if (lastAIBox) {
        overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
        overlayCtx.strokeStyle = "#ffd700";
        overlayCtx.lineWidth = 3;
        overlayCtx.strokeRect(
            lastAIBox.minX,
            lastAIBox.minY,
            lastAIBox.width,
            lastAIBox.height
        );
    }

    log("Frame frozen ✔");

    // Extract pixel data
    const pixels = palmCtx.getImageData(0, 0, palmCanvas.width, palmCanvas.height);

    // Selected hand
    const selectedHand = document.getElementById("handPref").value;

    const analysis = analyzePalm(pixels, selectedHand);

    outputBox.textContent =
        "🧠 Sathyadarshana Mini Report – V230\n\n" +
        analysis.miniReport;

    log("AI analysis completed ✔");
}

/* ------------------------------------------------------------
   DEBUG LOGS
------------------------------------------------------------- */
function log(msg) {
    debugBox.textContent += "✔ " + msg + "\n";
}
function error(msg) {
    debugBox.textContent += "🔥 " + msg + "\n";
}

/* ------------------------------------------------------------
   EXPORT TO WINDOW
------------------------------------------------------------- */
window.startCamera = startCamera;
window.captureHand = captureHand;

export default { startCamera, captureHand };
