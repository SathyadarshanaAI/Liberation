/* =====================================================
   🕉️ THE SEED · Palmistry AI · V300
   MediaPipe + PNG Hand Overlay + Freeze Capture
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
let lastHand = null;

let currentMode = "LEFT";  // auto: LEFT → RIGHT

/* =====================================================
   LOAD PNG HAND GUIDES
   ===================================================== */
const leftHandImg = new Image();
leftHandImg.src = "left-hand.png";

const rightHandImg = new Image();
rightHandImg.src = "right-hand.png";

/* =====================================================
   LOAD MEDIAPIPE HAND DETECTOR
   ===================================================== */
async function loadHandModel() {
    try {
        log("Loading MediaPipe Hands…");

        await import("https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js");
        await import("https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js");
        await import("https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js");

        mpHands = window.Hands;

        hands = new mpHands({
            locateFile: (f) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}`
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
        error("Model load failed: " + e.message);
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
        log("Place your LEFT hand inside the guide 🫲");

    } catch (e) {
        error("Camera failed: " + e.message);
    }
}

/* =====================================================
   LIVE FRAME LOOP → AI
   ===================================================== */
function startFrameLoop() {
    const loop = async () => {
        if (!running) return;

        if (hands) await hands.send({ image: video });

        drawOverlayGuide();   // Always draw PNG guide

        requestAnimationFrame(loop);
    };
    loop();
}

/* =====================================================
   WHEN HAND DETECTED
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
   DRAW PNG HAND GUIDE OVERLAY (MAIN FEATURE)
   ===================================================== */
function drawOverlayGuide() {
    overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

    let img = (currentMode === "LEFT") ? leftHandImg : rightHandImg;

    const w = overlayCanvas.width * 0.80;
    const h = overlayCanvas.height * 0.80;

    const x = (overlayCanvas.width - w) / 2;
    const y = (overlayCanvas.height - h) / 2;

    overlayCtx.globalAlpha = 0.60;
    overlayCtx.drawImage(img, x, y, w, h);
    overlayCtx.globalAlpha = 1.0;
}

/* =====================================================
   CAPTURE HAND IMAGE (FREEZE)
   ===================================================== */
export async function captureHand() {
    if (!lastHand) {
        error("No hand detected! Keep hand inside guide.");
        return;
    }

    document.getElementById("palmPreviewBox").style.display = "block";

    resizePalmCanvas();
    resizeOverlay();

    palmCtx.drawImage(video, 0, 0, palmCanvas.width, palmCanvas.height);

    log("Palm captured ✔");

    if (currentMode === "LEFT") {
        currentMode = "RIGHT";
        log("Now place your RIGHT hand inside the guide 👉");
    } else {
        log("Both hands captured ✔ Completed!");
    }
}

/* =====================================================
   CANVAS RESIZE
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
   DEBUG HELPERS (OPTIMIZED)
   ===================================================== */
function log(msg) {
    dbg.textContent += "✔ " + msg + "\n";
    dbg.scrollTop = dbg.scrollHeight;

    if (dbg.textContent.length > 8000)
        dbg.textContent = dbg.textContent.slice(-4000);
}

function error(msg) {
    dbg.textContent += "🔥 ERROR: " + msg + "\n";
    dbg.scrollTop = dbg.scrollHeight;

    if (dbg.textContent.length > 8000)
        dbg.textContent = dbg.textContent.slice(-4000);
}

/* =====================================================
   SAFE EXPORTS
   ===================================================== */
window.startCamera = () => {
    try { startCamera(); }
    catch (e) { error("startCamera failed: " + e.message); }
};

window.captureHand = () => {
    try { captureHand(); }
    catch (e) { error("captureHand failed: " + e.message); }
};
