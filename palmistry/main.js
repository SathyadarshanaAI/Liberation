/* ========================================== 🕉️ THE SEED · Palmistry AI · V120 MAIN.JS — FULLY UPDATED ========================================== */

let video = document.getElementById("video"); let palmCanvas = document.getElementById("palmCanvas"); let overlayCanvas = document.getElementById("overlayCanvas"); let output = document.getElementById("output"); let dbg = document.getElementById("debugConsole");

const palmCtx = palmCanvas.getContext("2d"); const overlayCtx = overlayCanvas.getContext("2d");

/* ============================ CAMERA INITIALIZATION ============================ */ export async function startCamera() { try { const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }); video.srcObject = stream; log("Camera started"); } catch (e) { error("Camera failed: " + e.message); } }

/* ============================ CAPTURE HAND FRAME ============================ */ export function captureHand() { try { resizePalmCanvas(); palmCtx.drawImage(video, 0, 0, palmCanvas.width, palmCanvas.height);

document.getElementById("palmPreviewBox").style.display = "block";
    resizeOverlay();
    log("Hand captured successfully");
} catch (e) {
    error("Capture failed: " + e.message);
}

}

/* ============================ RESIZING FOR PERFECT ALIGNMENT ============================ */ function resizePalmCanvas() { let box = document.getElementById("palmPreviewBox"); palmCanvas.width = box.offsetWidth; palmCanvas.height = box.offsetWidth * 1.333; }

function resizeOverlay() { overlayCanvas.width = palmCanvas.width; overlayCanvas.height = palmCanvas.height; }

window.addEventListener("resize", () => { if (document.getElementById("palmPreviewBox").style.display === "block") { resizePalmCanvas(); resizeOverlay(); } });

/* ============================ DRAW PALM LINES (Mock Example) ============================ */ export function drawPalmLines(lines = []) { overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

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

/* ============================ DEBUG HELPERS ============================ */ function log(msg) { dbg.textContent += "✔ " + msg + "\n"; }

function error(msg) { dbg.textContent += "🔥 ERROR: " + msg + "\n"; }

/* ============================ EXPORT DEFAULT ============================ */ export default { startCamera, captureHand, drawPalmLines };

/* === Make functions available to HTML buttons === */ window.startCamera = startCamera; window.captureHand = captureHand;
