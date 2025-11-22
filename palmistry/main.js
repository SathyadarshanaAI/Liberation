/* ============================================================
   🕉️ THE SEED · Palmistry AI · V220
   MAIN.JS — Dual Hand Capture + PNG Guide + AI Box
   Compatible with palm-engine-v2.js
   ============================================================ */

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

// Capture flow
let leftCaptured = false;
let rightCaptured = false;

let leftImage = null;
let rightImage = null;

let leftLandmarks = null;
let rightLandmarks = null;

// PNG GUIDES
const leftGuide = new Image();
leftGuide.src = "assets/left.png";

const rightGuide = new Image();
rightGuide.src = "assets/right.png";

/* ============================================================
   LOAD MEDIAPIPE
   ============================================================ */
async function loadHandModel() {
    try {
        log("Loading MediaPipe Hands…");

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

/* ============================================================
   START CAMERA
   ============================================================ */
async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" }
        });

        video.srcObject = stream;
        running = true;
        startLoop();

        log("Camera started ✔");

        if (!leftCaptured)
            log("📌 Place your LEFT hand inside the guide 🖐️");
        else
            log("👉 Now place your RIGHT hand inside the guide 🤚");

    } catch (e) {
        error("Camera failed: " + e.message);
    }
}

/* ============================================================
   FRAME LOOP
   ============================================================ */
function startLoop() {
    const loop = async () => {
        if (!running) return;

        if (hands) await hands.send({ image: video });

        requestAnimationFrame(loop);
    };
    loop();
}

/* ============================================================
   WHEN HAND DETECTED
   ============================================================ */
function onHandResults(results) {

    overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

    // Draw PNG guide
    let img = leftCaptured ? rightGuide : leftGuide;
    overlayCtx.drawImage(img, 0, 0, overlayCanvas.width, overlayCanvas.height);

    if (!results.multiHandLandmarks ||
        results.multiHandLandmarks.length === 0) {
        lastHand = null;
        return;
    }

    lastHand = results.multiHandLandmarks[0];

    drawAIBox(lastHand);
}

/* ============================================================
   DRAW AI BOX AROUND DETECTED HAND
   ============================================================ */
function drawAIBox(points) {
    const xs = points.map(p => p.x * overlayCanvas.width);
    const ys = points.map(p => p.y * overlayCanvas.height);

    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    overlayCtx.strokeStyle = "#FFD700";
    overlayCtx.lineWidth = 3;
    overlayCtx.strokeRect(minX, minY, maxX - minX, maxY - minY);

    log("✔ AI palm box drawn");
}

/* ============================================================
   CAPTURE HAND
   ============================================================ */
async function captureHand() {

    if (!lastHand) {
        error("No hand detected! Keep hand inside guide.");
        return;
    }

    document.getElementById("palmPreviewBox").style.display = "block";

    resizePalmCanvas();
    resizeOverlay();

    palmCtx.drawImage(
        video,
        0,
        0,
        palmCanvas.width,
        palmCanvas.height
    );

    drawAIBox(lastHand);

    let captured = palmCanvas.toDataURL("image/png");

    if (!leftCaptured) {
        leftCaptured = true;
        leftImage = captured;
        leftLandmarks = structuredClone(lastHand);

        log("✔ Left palm captured");

        log("👉 Now place your RIGHT hand inside the guide 🤚");
    }

    else if (!rightCaptured) {
        rightCaptured = true;
        rightImage = captured;
        rightLandmarks = structuredClone(lastHand);

        log("✔ Right palm captured");

        generateFinalReport();
    }
}

/* ============================================================
   RESIZE CANVAS
   ============================================================ */
function resizePalmCanvas() {
    const w = palmCanvas.parentElement.clientWidth;
    palmCanvas.width = w;
    palmCanvas.height = w * (4 / 3);
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

/* ============================================================
   FINAL REPORT GENERATION
   ============================================================ */
async function generateFinalReport() {

    log("🔮 Generating Sathyadarshana Insight Report…");

    const report = window.PalmEngineV2.generate({
        leftPoints: leftLandmarks,
        rightPoints: rightLandmarks,
        leftImage,
        rightImage
    });

    document.getElementById("output").textContent =
        "=== SATHYADARSHANA PALM REPORT ===\n\n" +
        report +
        "\n\n✔ Both hands analyzed\n";
}

/* ============================================================
   DEBUG HELPERS
   ============================================================ */
function log(msg) {
    dbg.textContent += "✔ " + msg + "\n";
}

function error(msg) {
    dbg.textContent += "🔥 ERROR: " + msg + "\n";
}

/* EXPORT */
window.startCamera = startCamera;
window.captureHand = captureHand;
