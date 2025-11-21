/* =====================================================
   🕉️ THE SEED · Palmistry AI · V230
   MAIN.JS — MediaPipe Stable + Freeze Capture Fixed
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

let boxMemory = [];      // ← NEW FIX
let smoothBox = null;    // ← NEW FIX

/* =====================================================
   LOAD MEDIAPIPE
   ===================================================== */
async function loadHandModel() {
    try {
        log("Loading MediaPipe Hands...");

        await import("https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js");
        await import("https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js");
        await import("https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js");

        mpHands = window.Hands;

        hands = new mpHands({
            locateFile: file =>
                `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
        });

        hands.setOptions({
            maxNumHands: 1,
            modelComplexity: 1,
            minDetectionConfidence: 0.7,
            minTrackingConfidence: 0.7
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
    } catch (e) {
        error("Camera failed: " + e.message);
    }
}

/* =====================================================
   FRAME LOOP
   ===================================================== */
function startFrameLoop() {
    const loop = async () => {
        if (!running) return;
        if (hands) await hands.send({ image: video });
        requestAnimationFrame(loop);
    };
    loop();
}

/* =====================================================
   WHEN AI DETECTS HAND
   ===================================================== */
function onHandResults(results) {
    overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

    if (!results.multiHandLandmarks ||
        results.multiHandLandmarks.length === 0) {
        lastHand = null;
        return;
    }

    lastHand = results.multiHandLandmarks[0];

    drawStabilizedBox(lastHand);
}

/* =====================================================
   AI BOX — Smooth Stabilizer
   ===================================================== */
function drawStabilizedBox(points) {

    const xs = points.map(p => p.x * overlayCanvas.width);
    const ys = points.map(p => p.y * overlayCanvas.height);

    const box = {
        x: Math.min(...xs),
        y: Math.min(...ys),
        w: Math.max(...xs) - Math.min(...xs),
        h: Math.max(...ys) - Math.min(...ys)
    };

    boxMemory.push(box);
    if (boxMemory.length > 5) boxMemory.shift(); // Keep last 5 frames

    smoothBox = boxMemory.reduce((a, b) => ({
        x: a.x + b.x,
        y: a.y + b.y,
        w: a.w + b.w,
        h: a.h + b.h
    }), { x: 0, y: 0, w: 0, h: 0 });

    smoothBox.x /= boxMemory.length;
    smoothBox.y /= boxMemory.length;
    smoothBox.w /= boxMemory.length;
    smoothBox.h /= boxMemory.length;

    overlayCtx.strokeStyle = "#00e5ff";
    overlayCtx.lineWidth = 3;
    overlayCtx.strokeRect(smoothBox.x, smoothBox.y, smoothBox.w, smoothBox.h);

    log("AI palm box drawn ✔");
}

/* =====================================================
   CAPTURE HAND (FREEZE FRAME)
   ===================================================== */
export async function captureHand() {
    try {
        document.getElementById("palmPreviewBox").style.display = "block";

        resizePalmCanvas();
        resizeOverlay();

        if (video.readyState < 2) {
            await new Promise(res => setTimeout(res, 150));
        }

        palmCtx.drawImage(video, 0, 0, palmCanvas.width, palmCanvas.height);

        if (smoothBox) {
            overlayCtx.strokeRect(smoothBox.x, smoothBox.y, smoothBox.w, smoothBox.h);
        }

        log("Palm captured successfully ✔ (Freeze OK)");
    } catch (e) {
        error("Capture failed: " + e.message);
    }
}

/* =====================================================
   RESIZING
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
    if (document.getElementById("palmPreviewBox").style.display === "block") {
        resizePalmCanvas();
        resizeOverlay();
    }
});

/* =====================================================
   DEBUG
   ===================================================== */
function log(msg) {
    dbg.textContent += "✔ " + msg + "\n";
}

function error(msg) {
    dbg.textContent += "🔥 ERROR: " + msg + "\n";
}

export default { startCamera, captureHand };

window.startCamera = startCamera;
window.captureHand = captureHand;
