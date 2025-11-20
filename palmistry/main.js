/* ===============================
   THE SEED · Palmistry Engine · V130
   FINAL STABLE CONTROLLER (AUTO-FOCUS + COLOR FIX + LINE OVERLAY)
   =============================== */

console.log("🌿 THE SEED Controller Loaded · V130");

const video = document.getElementById("video");
const outputBox = document.getElementById("output");
const palmBox = document.getElementById("palmPreviewBox");
const palmCanvas = document.getElementById("palmCanvas");
const overlayCanvas = document.getElementById("overlayCanvas");
const debugConsole = document.getElementById("debugConsole");

let stream = null;
let userData = {};
let lastImageData = null;

/* Debugging */
function dbg(msg) {
    console.log(msg);
    if (debugConsole) debugConsole.textContent += msg + "\n";
}

/* Error Handlers */
window.onerror = function (msg, url, line, col, error) {
    dbg(`🔥 ERROR: ${msg}\nFILE: ${url}\nLINE: ${line}\n`);
};

window.onunhandledrejection = function (e) {
    dbg("🚫 PROMISE ERROR: " + JSON.stringify(e.reason));
};

/* Save User Profile */
window.saveUserForm = function () {
    userData = {
        name: document.getElementById("userName").value,
        gender: document.getElementById("userGender").value,
        dob: document.getElementById("userDOB").value,
        country: document.getElementById("userCountry").value,
        hand: document.getElementById("handPref").value,
        note: document.getElementById("userNote").value
    };

    outputBox.textContent = "User profile saved ✔ Ready to scan.";
    dbg("📝 User profile saved");
};

/* Start Camera */
window.startCamera = async function () {
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: "environment",
                exposureMode: "continuous",
                focusMode: "continuous"
            }
        });

        video.srcObject = stream;
        await video.play();

        outputBox.textContent = "Camera active ✔ Place your hand.";
        dbg("📷 Camera active");

    } catch (e) {
        outputBox.textContent = "Camera error!";
        dbg("Camera Error: " + e);
    }
};

/* AUTO-FOCUS SAFE CAPTURE */
window.captureHand = function () {

    if (!video.srcObject) {
        outputBox.textContent = "Camera not active!";
        return;
    }

    outputBox.textContent = "Stabilizing camera… hold steady…";
    dbg("⏳ Waiting for auto-focus & exposure…");

    setTimeout(() => {

        const c = palmCanvas;
        const ctx = c.getContext("2d");

        c.width = video.videoWidth;
        c.height = video.videoHeight;

        // Natural colors (no brightness wash)
        ctx.drawImage(video, 0, 0, c.width, c.height);

        // Stop camera → freeze frame
        video.pause();
        if (stream) stream.getTracks().forEach(t => t.stop());

        lastImageData = ctx.getImageData(0, 0, c.width, c.height);

        palmBox.style.display = "block";
        overlayCanvas.width = c.width;
        overlayCanvas.height = c.height;

        dbg("📸 Stable frame captured");
        outputBox.textContent = "Hand captured ✔ Analyzing...";

        runPalmAnalysis(lastImageData);

    }, 250);
};

/* ==========================
   THE SEED ANALYSIS PIPELINE
   ========================== */

async function runPalmAnalysis(imageData) {
    try {

        dbg("🔍 Loading THE SEED Engines…");

        const geoMod   = await import("./analysis/palm-geometry.js");
        const lineMod  = await import("./analysis/palm-lines.js");
        const mountMod = await import("./analysis/palm-mounts.js");
        const auraMod  = await import("./analysis/palm-aura.js");
        const repMod   = await import("./analysis/palm-report.js");
        const drawMod  = await import("./analysis/palm-draw.js");  // NEW: color draw

        const geometry = geoMod.detectPalmGeometry(video, palmCanvas);
        const lines    = lineMod.extractPalmLines(palmCanvas);
        const mounts   = mountMod.analyzeMounts(palmCanvas);
        const aura     = auraMod.scanAura(palmCanvas);

        dbg("Lines: " + JSON.stringify(lines.lines));
        dbg("Mounts: " + JSON.stringify(mounts.mounts));
        dbg("Aura: " + JSON.stringify(aura.aura));

        // 📌 DRAW COLORED LINES (8 colors)
        drawMod.drawLines(overlayCanvas, lines.lines);

        const report = repMod.generatePalmReport(
            lines.lines,
            mounts.mounts,
            aura.aura
        );

        dbg("✔ REPORT READY");
        outputBox.textContent = JSON.stringify(report, null, 2);

    } catch (err) {
        dbg("FINAL ERROR: " + err);
        outputBox.textContent = "Error during analysis!";
    }
}
