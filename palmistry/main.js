/* ========================================== 🕉️ THE SEED · Palmistry AI · V120 MAIN.JS — FIXED VERSION (TensorFlow FIX + saveUserForm FIX) ========================================== */

let video = document.getElementById("video"); let palmCanvas = document.getElementById("palmCanvas"); let overlayCanvas = document.getElementById("overlayCanvas"); let output = document.getElementById("output"); let dbg = document.getElementById("debugConsole");

const palmCtx = palmCanvas.getContext("2d"); const overlayCtx = overlayCanvas.getContext("2d");

let handModel = null;

/* ============================ LOAD AI HAND MODEL (100% MOBILE SAFE) ============================ */ async function loadHandModel() { try { log("Loading AI Hand Model...");

// Mobile-safe TensorFlow
    await import("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@2.0.0");
    await import("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-core@2.0.0");
    await import("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-converter@2.0.0");

    const handposeModule = await import("https://cdn.jsdelivr.net/npm/@tensorflow-models/handpose");

    handModel = await handposeModule.load();
    log("AI Model Loaded ✔");

} catch (e) {
    error("AI Model Load Failed: " + e.message);
}

}

loadHandModel();

/* ============================ CAMERA INITIALIZATION ============================ */ export async function startCamera() { try { const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }); video.srcObject = stream; log("Camera started"); } catch (e) { error("Camera failed: " + e.message); } }

/* ============================ AI HAND DETECTION ============================ */ async function detectHand() { if (!handModel) { log("Hand model not ready..."); return null; }

const predictions = await handModel.estimateHands(video);

if (predictions.length === 0) {
    log("No hand detected");
    return null;
}

const hand = predictions[0];
const keypoints = hand.landmarks;

const xs = keypoints.map(p => p[0]);
const ys = keypoints.map(p => p[1]);

const minX = Math.min(...xs);
const maxX = Math.max(...xs);
const minY = Math.min(...ys);
const maxY = Math.max(...ys);

return { minX, maxX, minY, maxY, keypoints };

}

/* ============================ AI PALM BOX DRAWING ============================ */ async function autoPalmCapture() { const hand = await detectHand(); if (!hand) return;

overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

const scaleX = palmCanvas.width / video.videoWidth;
const scaleY = palmCanvas.height / video.videoHeight;

const x = hand.minX * scaleX;
const y = hand.minY * scaleY;
const w = (hand.maxX - hand.minX) * scaleX;
const h = (hand.maxY - hand.minY) * scaleY;

overlayCtx.strokeStyle = "#00e5ff";
overlayCtx.lineWidth = 3;
overlayCtx.strokeRect(x, y, w, h);

log("Palm outline drawn ✔");

}

/* ============================ CAPTURE HAND FRAME ============================ */ export async function captureHand() { try { document.getElementById("palmPreviewBox").style.display = "block";

resizePalmCanvas();
    resizeOverlay();

    palmCtx.drawImage(video, 0, 0, palmCanvas.width, palmCanvas.height);

    await autoPalmCapture();

    log("Palm captured successfully (AI Outline Mode)");

} catch (e) {
    error("Capture failed: " + e.message);
}

}

/* ============================ RESIZING ============================ */ function resizePalmCanvas() { const w = palmCanvas.parentElement.clientWidth; palmCanvas.width = w; palmCanvas.height = w * 1.333; }

function resizeOverlay() { overlayCanvas.width = palmCanvas.width; overlayCanvas.height = palmCanvas.height; }

window.addEventListener("resize", () => { if (document.getElementById("palmPreviewBox").style.display === "block") { resizePalmCanvas(); resizeOverlay(); } });

/* ============================ DEBUG HELPERS ============================ */ function log(msg) { dbg.textContent += "✔ " + msg + " "; }

function error(msg) { dbg.textContent += "🔥 ERROR: " + msg + " "; }

/* ============================ FIX — saveUserForm() MISSING ============================ */ function saveUserForm() { log("User form saved ✔ (placeholder)"); } window.saveUserForm = saveUserForm;

/* ============================ EXPORTS ============================ */ export default { startCamera, captureHand }; window.startCamera = startCamera; window.captureHand = captureHand;
