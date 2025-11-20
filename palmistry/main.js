/* ========================================== 🕉️ THE SEED · Palmistry AI · V120 MAIN.JS — CLEAN FIXED VERSION (NO SYNTAX ERRORS) ========================================== */

let video = document.getElementById("video"); let palmCanvas = document.getElementById("palmCanvas"); let overlayCanvas = document.getElementById("overlayCanvas"); let output = document.getElementById("output"); let dbg = document.getElementById("debugConsole");

const palmCtx = palmCanvas.getContext("2d"); const overlayCtx = overlayCanvas.getContext("2d");

/* ============================ CAMERA INITIALIZATION ============================ */ export async function startCamera() { try { const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }); video.srcObject = stream; log("Camera started"); } catch (e) { error("Camera failed: " + e.message); } }

/* ============================ CAPTURE HAND FRAME ============================ */ export function captureHand() { try { // 1. SHOW PREVIEW FIRST document.getElementById("palmPreviewBox").style.display = "block";

// 2. Resize canvas AFTER becoming visible
    resizePalmCanvas();
    resizeOverlay();

    // 3. Draw video frame NOW (valid canvas size)
    palmCtx.drawImage(video, 0, 0, palmCanvas.width, palmCanvas.height);

    log("Hand captured successfully (Visible Mode)");
} catch (e) {
    error("Capture failed: " + e.message);
}

}

/* ============================ RESIZING FOR PERFECT ALIGNMENT ============================ */ function resizePalmCanvas() { const w = palmCanvas.parentElement.clientWidth; palmCanvas.width = w; palmCanvas.height = w * 1.333; }

function resizeOverlay() { overlayCanvas.width = palmCanvas.width; overlayCanvas.height = palmCanvas.height; }

window.addEventListener("resize", () => { if (document.getElementById("palmPreviewBox").style.display === "block") { resizePalmCanvas(); resizeOverlay(); } });

/* ============================ DRAW PALM LINES (Placeholder) ============================ */ export function drawPalmLines(lines = []) { overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

overlayCtx.strokeStyle = "cyan";
overlayCtx.lineWidth = 3;

for (let l of lines) {
    overlayCtx.beginPath();
    overlayCtx.moveTo(l.x1, l.y1);
    overlayCtx.lineTo(l.x2, l.y2);
    overlayCtx.stroke();
}

log("Palm lines drawn");

}

/* ============================ DEBUG HELPERS ============================ */ function log(msg) { dbg.textContent += "✔ " + msg + " "; }

function error(msg) { dbg.textContent += "🔥 ERROR: " + msg + " "; }

/* ============================ EXPORT DEFAULT ============================ */ export default { startCamera, captureHand, drawPalmLines };

/* ============================ MAKE FUNCTIONS GLOBAL FOR HTML BUTTONS ============================ */ window.startCamera = startCamera; window.captureHand = captureHand;
