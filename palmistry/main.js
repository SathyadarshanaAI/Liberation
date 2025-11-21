/* ===================================================== 🕉️ THE SEED · Palmistry AI · V200 MAIN.JS — MEDIAPIPE HANDS (NO TENSORFLOW) 100% MOBILE-Compatible Palm Detector Engine ===================================================== */

let video = document.getElementById("video"); let palmCanvas = document.getElementById("palmCanvas"); let overlayCanvas = document.getElementById("overlayCanvas"); let output = document.getElementById("output"); let dbg = document.getElementById("debugConsole");

const palmCtx = palmCanvas.getContext("2d"); const overlayCtx = overlayCanvas.getContext("2d");

let mpHands = null; let hands = null; let running = false;

/* ===================================================== LOAD MEDIAPIPE HANDS (GOOGLE OFFICIAL) ===================================================== */ async function loadHandModel() { try { log("Loading MediaPipe Hands...");

await import("https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js");
    await import("https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js");
    await import("https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js");

    mpHands = window.Hands;

    hands = new mpHands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
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

/* ===================================================== CAMERA START ===================================================== */ export async function startCamera() { try { const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }}); video.srcObject = stream;

running = true;
    startFrameLoop();

    log("Camera started ✔");
} catch (e) {
    error("Camera failed: " + e.message);
}

}

/* ===================================================== LIVE FRAME → MEDIAPIPE ===================================================== */ function startFrameLoop() { const loop = async () => { if (!running) return;

if (hands) await hands.send({image: video});

    requestAnimationFrame(loop);
};
loop();

}

/* ===================================================== WHEN MEDIAPIPE DETECTS HAND ===================================================== */ let lastHand = null;

function onHandResults(results) { overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
    lastHand = null;
    return;
}

const landmarks = results.multiHandLandmarks[0];
lastHand = landmarks;

drawHandOutline(landmarks);

}

/* ===================================================== DRAW AI OUTLINE BOX ===================================================== */ function drawHandOutline(points) { const xs = points.map(p => p.x * overlayCanvas.width); const ys = points.map(p => p.y * overlayCanvas.height);

const minX = Math.min(...xs);
const maxX = Math.max(...xs);
const minY = Math.min(...ys);
const maxY = Math.max(...ys);

overlayCtx.strokeStyle = "#00e5ff";
overlayCtx.lineWidth = 3;
overlayCtx.strokeRect(minX, minY, maxX - minX, maxY - minY);

log("AI palm box drawn ✔");

}

/* ===================================================== CAPTURE HAND FRAME (FREEZE) ===================================================== */ export async function captureHand() { try { document.getElementById("palmPreviewBox").style.display = "block";

resizePalmCanvas();
    resizeOverlay();

    palmCtx.drawImage(video, 0, 0, palmCanvas.width, palmCanvas.height);

    if (lastHand) drawHandOutline(lastHand);

    log("Palm captured successfully ✔");

} catch (e) {
    error("Capture failed: " + e.message);
}

}

/* ===================================================== RESIZING HAND CANVAS ===================================================== */ function resizePalmCanvas() { const w = palmCanvas.parentElement.clientWidth; palmCanvas.width = w; palmCanvas.height = w * 1.333; }

function resizeOverlay() { overlayCanvas.width = palmCanvas.width; overlayCanvas.height = palmCanvas.height; }

window.addEventListener("resize", () => { if (document.getElementById("palmPreviewBox").style.display === "block") { resizePalmCanvas(); resizeOverlay(); } });

/* ===================================================== DEBUG HELPERS ===================================================== */ function log(msg) { dbg.textContent += "✔ " + msg + " "; }

function error(msg) { dbg.textContent += "🔥 ERROR: " + msg + " "; }

/* ===================================================== EXPORTS ===================================================== */ export default { startCamera, captureHand };

window.startCamera = startCamera; window.captureHand = captureHand;
