/* =====================================================
   🕉️ THE SEED · Palmistry AI · V230
   PNG Guide + AI Box + Stable Freeze Mode
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

let mode = "LEFT";   // LEFT → RIGHT flow
let leftCaptured = false;
let rightCaptured = false;

// LOAD GUIDE PNG
const guideImg = new Image();
guideImg.src = "left-hand-outline.png"; // <-- CHANGE FILE NAME IF NEEDED

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

        mode = "LEFT";
        leftCaptured = false;
        rightCaptured = false;

        log("Camera started ✔");
        log("📌 Place your LEFT hand inside the guide ✋");

        startFrameLoop();

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

        requestAnimationFrame(loop);
    };
    loop();
}

/* =====================================================
   ON HAND DETECTION
   ===================================================== */
function onHandResults(results) {
    overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

    drawGuideOutline();

    if (!results.multiHandLandmarks ||
        results.multiHandLandmarks.length === 0) {
        lastHand = null;
        return;
    }

    lastHand = results.multiHandLandmarks[0];

    drawAIBox(lastHand);
}

/* =====================================================
   GUIDE PNG
   ===================================================== */
function drawGuideOutline() {
    try {
        overlayCtx.drawImage(
            guideImg,
            overlayCanvas.width * 0.1,
            overlayCanvas.height * 0.08,
            overlayCanvas.width * 0.8,
            overlayCanvas.height * 0.85
        );
    } catch {}
}

/* =====================================================
   DRAW AI BOX
   ===================================================== */
function drawAIBox(points) {
    const xs = points.map(p => p.x * overlayCanvas.width);
    const ys = points.map(p => p.y * overlayCanvas.height);

    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    overlayCtx.strokeStyle = "gold";
    overlayCtx.lineWidth = 3;
    overlayCtx.strokeRect(minX, minY, maxX - minX, maxY - minY);

    log("✔ AI palm box drawn");
}

/* =====================================================
   CAPTURE HAND
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

    if (lastHand) drawAIBox(lastHand);

    if (mode === "LEFT") {
        leftCaptured = true;
        log("✔ Left palm captured");
        mode = "RIGHT";

        guideImg.src = "right-hand-outline.png";
        log("👉 Now place your RIGHT hand inside the guide");

        return;
    }

    if (mode === "RIGHT") {
        rightCaptured = true;
        log("✔ Right palm captured");
        log("🎉 Both hands captured ✔ All done!");
        running = false;
    }
}

/* =====================================================
   RESIZE HANDLERS
   ===================================================== */
function resizePalmCanvas() {
    palmCanvas.width = palmCanvas.parentElement.clientWidth;
    palmCanvas.height = palmCanvas.width * 1.333;
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
   DEBUG FUNCTIONS
   ===================================================== */
function log(msg) {
    dbg.textContent += "✔ " + msg + "\n";
}

function error(msg) {
    dbg.textContent += "🔥 ERROR: " + msg + "\n";
}

window.startCamera = startCamera;
window.captureHand = captureHand;
