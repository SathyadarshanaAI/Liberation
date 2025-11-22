/* ================================================================
   🕉️ THE SEED · Palmistry AI · V230
   MAIN.JS — Camera + Freeze + Analyzer Connection
   ================================================================ */

import { analyzePalm } from "./palm-engine-v230.js";

let video, palmCanvas, overlayCanvas, outputBox, debugBox;
let palmCtx, overlayCtx;

/* ------------------------------------------------------------
   INITIALIZE DOM REFERENCES
------------------------------------------------------------- */
function initRefs() {
    video = document.getElementById("video");
    palmCanvas = document.getElementById("palmCanvas");
    overlayCanvas = document.getElementById("overlayCanvas");

    outputBox = document.getElementById("output");
    debugBox = document.getElementById("debugConsole");

    palmCtx = palmCanvas.getContext("2d");
    overlayCtx = overlayCanvas.getContext("2d");
}

/* ------------------------------------------------------------
   START CAMERA
------------------------------------------------------------- */
export async function startCamera() {
    initRefs();

    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" }
        });

        video.srcObject = stream;

        log("Camera started ✔");

    } catch (err) {
        error("Camera error: " + err);
    }
}

/* ------------------------------------------------------------
   CAPTURE HAND → FREEZE FRAME
------------------------------------------------------------- */
export async function captureHand() {
    initRefs();

    document.getElementById("palmPreviewBox").style.display = "block";

    // Resize canvas to match video frame
    palmCanvas.width = video.videoWidth;
    palmCanvas.height = video.videoHeight;

    overlayCanvas.width = video.videoWidth;
    overlayCanvas.height = video.videoHeight;

    // Draw frame
    palmCtx.drawImage(video, 0, 0, palmCanvas.width, palmCanvas.height);

    log("Frame captured ✔");

    // For future: overlay AI box or PNG
    overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

    // Extract pixel data
    const pixels = palmCtx.getImageData(
        0,
        0,
        palmCanvas.width,
        palmCanvas.height
    );

    // Identify selected hand
    const selectedHand = document.getElementById("handPref").value || "Unknown";

    // Build profile object
    const profile = {
        name: document.getElementById("userName").value,
        dob: document.getElementById("userDOB").value,
        gender: document.getElementById("userGender").value,
        note: document.getElementById("userNote").value,
        country: document.getElementById("userCountry").value,
    };

    log("Analyzing palm…");

    // Call analyzer engine
    const analysis = analyzePalm(pixels, selectedHand, profile);

    // Display report
    outputBox.textContent =
        "🧠 Sathyadarshana Mini Report (V230)\n\n" +
        analysis.miniReport;

    log("Analysis complete ✔");
}

/* ------------------------------------------------------------
   DEBUG HELPERS
------------------------------------------------------------- */
function log(msg) {
    debugBox.textContent += "✔ " + msg + "\n";
}

function error(msg) {
    debugBox.textContent += "🔥 " + msg + "\n";
}

/* ------------------------------------------------------------
   EXPORT TO WINDOW (for index buttons)
------------------------------------------------------------- */
window.startCamera = startCamera;
window.captureHand = captureHand;

export default { startCamera, captureHand };
