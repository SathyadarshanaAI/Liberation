/* ===================================================== 🕉️ THE SEED · Palmistry AI · V300 MAIN.JS — Permanent AI BOX LOCK + SMOOTH + COLOR ===================================================== */

let video = document.getElementById("video"); let palmCanvas = document.getElementById("palmCanvas"); let overlayCanvas = document.getElementById("overlayCanvas"); let dbg = document.getElementById("debugConsole");

const palmCtx = palmCanvas.getContext("2d"); const overlayCtx = overlayCanvas.getContext("2d");

let mpHands = null; let hands = null; let running = false; let lastHand = null; let boxMemory = []; let lastStableBox = null; // 🔥 NEW — AI BOX LOCK

/* ===================================================== LOAD MEDIAPIPE HANDS ===================================================== */ async function loadHandModel() { try { log("Loading MediaPipe Hands...");

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

/* ===================================================== START CAMERA ===================================================== */ export async function startCamera() { try { const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });

video.srcObject = stream;
    running = true;
    startFrameLoop();

    log("Camera started ✔");
} catch (e) {
    error("Camera failed: " + e.message);
}

}

/* ===================================================== MAIN LOOP ===================================================== */ function startFrameLoop() { const loop = async () => { if (!running) return; if (hands) await hands.send({ image: video }); requestAnimationFrame(loop); }; loop(); }

/* ===================================================== WHEN HAND DETECTED ===================================================== */ function onHandResults(results) { overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
    return;
}

lastHand = results.multiHandLandmarks[0];
drawAIBox(lastHand);

}

/* ===================================================== DRAW AI BOX (LOCK + SMOOTH) ===================================================== */ function drawAIBox(points) { const xs = points.map(p => p.x * overlayCanvas.width); const ys = points.map(p => p.y * overlayCanvas.height);

const box = {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys)
};

// Save 10-frame history
boxMemory.push(box);
if (boxMemory.length > 10) boxMemory.shift();

const avg = arr => arr.reduce((a, b) => a + b, 0) / arr.length;

const smooth = {
    minX: avg(boxMemory.map(b => b.minX)),
    maxX: avg(boxMemory.map(b => b.maxX)),
    minY: avg(boxMemory.map(b => b.minY)),
    maxY: avg(boxMemory.map(b => b.maxY))
};

// LOCK BOX (Never loses hand)
lastStableBox = smooth;

drawBox(lastStableBox);
log("AI palm box drawn ✔");

}

/* ===================================================== BOX RENDER FUNCTION ===================================================== */ function drawBox(b) { overlayCtx.strokeStyle = "#ffd700"; // Cyan Neon overlayCtx.lineWidth = 4;

overlayCtx.strokeRect(
    b.minX,
    b.minY,
    b.maxX - b.minX,
    b.maxY - b.minY
);

}

/* ===================================================== CAPTURE HAND (PERMANENT BOX) ===================================================== */ export async function captureHand() { try { document.getElementById("palmPreviewBox").style.display = "block";

resizePalmCanvas();
    resizeOverlay();

    palmCtx.drawImage(video, 0, 0, palmCanvas.width, palmCanvas.height);

    if (lastStableBox) drawBox(lastStableBox);

    log("Palm captured successfully ✔ (LOCK MODE)");

} catch (e) {
    error("Capture failed: " + e.message);
}

}

/* ===================================================== RESIZE ===================================================== */ function resizePalmCanvas() { const w = palmCanvas.parentElement.clientWidth; palmCanvas.width = w; palmCanvas.height = w * 1.333; }

function resizeOverlay() { overlayCanvas.width = palmCanvas.width; overlayCanvas.height = palmCanvas.height; }

window.addEventListener("resize", () => { if (document.getElementById("palmPreviewBox").style.display === "block") { resizePalmCanvas(); resizeOverlay(); } });

/* ===================================================== DEBUG ===================================================== */ function log(msg) { dbg.textContent += "✔ " + msg + " "; }

function error(msg) { dbg.textContent += "🔥 ERROR: " + msg + " "; }

/* ===================================================== EXPORT ===================================================== */ export default { startCamera, captureHand };

window.startCamera = startCamera; window.captureHand = captureHand;
