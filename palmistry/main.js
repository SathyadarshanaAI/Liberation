/* ============================================================
   THE SEED · Palmistry AI · V220
   main.js — Camera + Hand Capture Controller
   ============================================================ */

let video = null;
let palmCanvas = null;
let overlayCanvas = null;
let output = null;
let debugConsole = null;
let ctxPalm = null;
let ctxOverlay = null;

/* INIT DOM REFS */
function initRefs() {
    video = document.getElementById("video");
    palmCanvas = document.getElementById("palmCanvas");
    overlayCanvas = document.getElementById("overlayCanvas");
    output = document.getElementById("output");
    debugConsole = document.getElementById("debugConsole");

    ctxPalm = palmCanvas.getContext("2d");
    ctxOverlay = overlayCanvas.getContext("2d");
}

/* ============================================================
   START CAMERA
   ============================================================ */
export async function startCamera() {
    initRefs();

    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" }
        });

        video.srcObject = stream;

        debugConsole.textContent += "✔ Camera started\n";
    } 
    catch (err) {
        debugConsole.textContent += "🔥 Camera Error: " + err + "\n";
    }
}

/* ============================================================
   CAPTURE HAND FROM CAMERA
   ============================================================ */
export function captureHand() {
    initRefs();

    // Show preview box
    document.getElementById("palmPreviewBox").style.display = "block";

    // Resize canvas
    palmCanvas.width = video.videoWidth;
    palmCanvas.height = video.videoHeight;

    // Draw current video frame
    ctxPalm.drawImage(video, 0, 0, palmCanvas.width, palmCanvas.height);

    output.textContent = "✔ Hand captured.\nProcessing…";
    debugConsole.textContent += "✔ Frame captured into palmCanvas\n";

    // For now basic processing
    basicLineScan();
}

/* ============================================================
   BASIC FAKE LINE SCAN (PLACEHOLDER)
   ============================================================ */
function basicLineScan() {
    output.textContent += "\n✔ AI line scan ready (V220 placeholder)\n";
    debugConsole.textContent += "✔ Placeholder line analysis executed\n";
}
