/* ===================================================== 🕉️ THE SEED · Palmistry AI · V300 ULTRA-STABLE MAIN.JS — MediaPipe Hands + Freeze Fix + Stabilized Box ===================================================== */

let video = document.getElementById("video"); let palmCanvas = document.getElementById("palmCanvas"); let overlayCanvas = document.getElementById("overlayCanvas"); let dbg = document.getElementById("debugConsole");

const palmCtx = palmCanvas.getContext("2d"); const overlayCtx = overlayCanvas.getContext("2d");

let mpHands = null; let hands = null; let running = false; let lastHand = null;

// === Stabilizer Memory === let boxMemory = []; let memorySize = 10;  // Last 10 frames smoothing

/* ===================================================== LOAD MEDIAPIPE HANDS ===================================================== */ async function loadHandModel() { try { log("Loading MediaPipe Hands...");

await import("https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js");
    await import("https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js");
    await import("https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js");

    mpHands = window.Hands;

    hands = new mpHands({
        locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
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

/* ===================================================== START CAMERA ===================================================== */ export async function startCamera() { try { const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });

video.srcObject = stream;
    running = true;
    startFrameLoop();

    log("Camera started ✔");

} catch (e) {
    error("Camera failed: " + e.message);
}

}

/* ===================================================== LIVE FRAME LOOP ===================================================== */ function startFrameLoop() { const loop = async () => { if (!running) return;

if (hands) await hands.send({ image: video });

    requestAnimationFrame(loop);
};
loop();

}

/* ===================================================== WHEN MEDIAPIPE DETECTS HAND ===================================================== */ function onHandResults(results) {

overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
    lastHand = null;
    return;
}

// Confidence check — ignore low-quality frames
if (results.multiHandedness && results.multiHandedness[0].score < 0.50) return;

lastHand = results.multiHandLandmarks[0];

drawHandOutline(lastHand);

}

/* ===================================================== STABILIZED HAND BOX ===================================================== */ function drawHandOutline(points) { const xs = points.map(p => p.x * overlayCanvas.width); const ys = points.map(p => p.y * overlayCanvas.height);

let box = {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys)
};

// Save to memory
boxMemory.push(box);
if (boxMemory.length > memorySize) boxMemory.shift();

// Smooth average
let avg = {
    minX: boxMemory.reduce((a,b)=>a+b.minX,0)/boxMemory.length,
    maxX: boxMemory.reduce((a,b)=>a+b.maxX,0)/boxMemory.length,
    minY: boxMemory.reduce((a,b)=>a+b.minY,0)/boxMemory.length,
    maxY: boxMemory.reduce((a,b)=>a+b.maxY,0)/boxMemory.length
};

overlayCtx.strokeStyle = "#00e5ff";
overlayCtx.lineWidth = 3;
overlayCtx.strokeRect(
    avg.minX,
    avg.minY,
    avg.maxX - avg.minX,
    avg.maxY - avg.minY
);

log("AI palm box drawn ✔ (Stabilized)");

}

/* ===================================================== FREEZE HAND ===================================================== */ export async function captureHand() { try { document.getElementById("palmPreviewBox").style.display = "block";

resizePalmCanvas();
    resizeOverlay();

    if (video.readyState < 2) {
        log("Waiting for camera frame...");
        await new Promise(res => setTimeout(res, 150));
    }

    palmCtx.drawImage(video, 0, 0, palmCanvas.width, palmCanvas.height);

    if (lastHand) drawHandOutline(lastHand);

    log("Palm captured successfully ✔ (Freeze OK)");

} catch (e) {
    error("Capture failed: " + e.message);
}

}

/* ===================================================== RESIZE CANVAS ===================================================== */ function resizePalmCanvas() { const w = palmCanvas.parentElement.clientWidth; palmCanvas.width = w; palmCanvas.height = w * 1.333; }

function resizeOverlay() { overlayCanvas.width = palmCanvas.width; overlayCanvas.height = palmCanvas.height; }

window.addEventListener("resize", () => { if (document.getElementById("palmPreviewBox").style.display === "block") { resizePalmCanvas(); resizeOverlay(); } });

/* ===================================================== DEBUG ===================================================== */ function log(msg) { dbg.textContent += "✔ " + msg + " "; }

function error(msg) { dbg.textContent += "🔥 ERROR: " + msg + " "; }

/* ===================================================== EXPORT ===================================================== */ export default { startCamera, captureHand };

window.startCamera = startCamera; window.captureHand = captureHand;
