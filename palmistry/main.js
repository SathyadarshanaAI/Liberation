/* =====================================================
   🕉️ THE SEED · Palmistry AI · V300
   MAIN.JS — Hand Overlay (PNG Guide Mode)
   ===================================================== */

let video = document.getElementById("video");
let palmCanvas = document.getElementById("palmCanvas");
let overlayCanvas = document.getElementById("overlayCanvas");
let dbg = document.getElementById("debugConsole");

const palmCtx = palmCanvas.getContext("2d");
const overlayCtx = overlayCanvas.getContext("2d");

let mpHands = null;
let hands = null;
let running = false;

let currentMode = "LEFT";   // LEFT → first | RIGHT → after scan
let lastHand = null;

/* =====================================================
   LOAD PNG OVERLAYS
   ===================================================== */
const leftHandImg = new Image();
leftHandImg.src = "left-hand.png";    //  <<——  ADD THIS FILE

const rightHandImg = new Image();
rightHandImg.src = "right-hand.png";  //  <<——  ADD THIS FILE

/* =====================================================
   LOAD MEDIAPIPE HANDS
   ===================================================== */
async function loadHandModel() {
    try {
        log("Loading MediaPipe Hands...");

        await import("https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js");
        await import("https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js");
        await import("https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js");

        mpHands = window.Hands;

        hands = new mpHands({
            locateFile: (file) =>
                `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
        });

        hands.setOptions({
            maxNumHands: 1,
            modelComplexity: 1,
            minDetectionConfidence: 0.6,
            minTrackingConfidence: 0.6
        });

        hands.onResults(onHandResults);

        log("MediaPipe Hands Loaded ✔");

    } catch (e) {
        error("Model Load Failed: " + e.message);
    }
}

loadHandModel();

/* =====================================================
   START CAMERA
   ===================================================== */
export async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" }
        });

        video.srcObject = stream;
        running = true;

        startFrameLoop();

        log("Camera started ✔");
        log("Place your LEFT hand inside the outline 🖐️");

    } catch (e) {
        error("Camera failed: " + e.message);
    }
}

/* =====================================================
   LIVE FRAME LOOP
   ===================================================== */
function startFrameLoop() {
    const loop = async () => {
        if (!running) return;

        if (hands) await hands.send({ image: video });

        drawOverlayGuide();    // <<— Always draw PNG overlay

        requestAnimationFrame(loop);
    };
    loop();
}

/* =====================================================
   DETECT HAND
   ===================================================== */
function onHandResults(results) {
    if (!results.multiHandLandmarks ||
        results.multiHandLandmarks.length === 0) {
        lastHand = null;
        return;
    }

    lastHand = results.multiHandLandmarks[0];
}

/* =====================================================
   DRAW PNG HAND GUIDE (MAIN FEATURE)
   ===================================================== */
function drawOverlayGuide() {
    overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

    let img = (currentMode === "LEFT") ? leftHandImg : rightHandImg;

    const w = overlayCanvas.width * 0.8;
    const h = overlayCanvas.height * 0.8;

    const x = (overlayCanvas.width - w) / 2;
    const y = (overlayCanvas.height - h) / 2;

    overlayCtx.globalAlpha = 0.55;
    overlayCtx.drawImage(img, x, y, w, h);
    overlayCtx.globalAlpha = 1.0;
}

/* =====================================================
   CAPTURE (FREEZE HAND)
   ===================================================== */
export async function captureHand() {
    if (!lastHand) {
        error("No hand detected! Place your hand inside outline.");
        return;
    }

    document.getElementById("palmPreviewBox").style.display = "block";

    resizePalmCanvas();
    resizeOverlay();

    palmCtx.drawImage(video, 0, 0, palmCanvas.width, palmCanvas.height);

    log("Palm captured ✔");

    // After left-hand scan → switch to right-hand mode
    if (currentMode === "LEFT") {
        currentMode = "RIGHT";
        log("Now place your RIGHT hand inside the outline 👉");
    } else {
        log("Both hands captured ✔ All done!");
    }
}

/* =====================================================
   RESIZE CANVAS
   ===================================================== */
function resizePalmCanvas() {
    const w = palmCanvas.parentElement.clientWidth;
    palmCanvas.width = w;
    palmCanvas.height = w * 1.333;
}

function resizeOverlay() {
    overlayCanvas.width = palmCanvas.width;
    overlayCanvas.height = palmCanvas.height;
}

window.addEventListener("resize", () => {
    resizePalmCanvas();
    resizeOverlay();
});

/* =====================================================
   DEBUG HELPERS
   ===================================================== */
function log(msg) {
    dbg.textContent += "✔ " + msg + "\n";
}

function error(msg) {
    dbg.textContent += "🔥 ERROR: " + msg + "\n";
}

/* EXPORT */
window.startCamera = startCamera;
window.captureHand = captureHand;
