/* ===============================
   THE SEED · Palmistry AI · V100
   Main Controller (REAL AI Version)
   =============================== */

console.log("🌿 REAL Palmistry Engine Loaded · V100");

const video = document.getElementById("video");
const outputBox = document.getElementById("output");
const palmBox = document.getElementById("palmPreviewBox");
const palmCanvas = document.getElementById("palmCanvas");
const langSelect = document.getElementById("langSelect");
const debugConsole = document.getElementById("debugConsole");

let stream = null;
let userData = {};
let lastImageData = null;

/* Debug print */
function dbg(msg) {
    console.log(msg);
    if (debugConsole) debugConsole.textContent += msg + "\n";
}

/* GLOBAL ERROR CATCHER */
window.onerror = function (msg, url, line, col, error) {
    dbg("🔥 GLOBAL ERROR: " + msg);
    dbg("FILE: " + url + " : " + line);
    dbg("STACK: " + (error?.stack || "no stack"));
};

/* PROMISE CATCHER */
window.onunhandledrejection = function (e) {
    dbg("🚫 PROMISE ERROR: " + JSON.stringify(e.reason));
};

/* Load languages */
(function loadLanguages() {
    const langs = ["EN", "SI", "TA", "HI", "BN"];
    langs.forEach(l => {
        let o = document.createElement("option");
        o.value = l.toLowerCase();
        o.textContent = l;
        langSelect.appendChild(o);
    });
})();

/* Save User Data */
window.saveUserForm = function () {
    userData = {
        name: document.getElementById("userName").value,
        gender: document.getElementById("userGender").value,
        dob: document.getElementById("userDOB").value,
        country: document.getElementById("userCountry").value,
        hand: document.getElementById("handPref").value,
        note: document.getElementById("userNote").value
    };

    dbg("User profile saved");
    dbg(JSON.stringify(userData));

    outputBox.textContent = "User profile saved. Scan your palm now.";
};

/* -----------------------------
   Open Camera (Autoplay Fixed)
------------------------------ */
window.startCamera = async function () {
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" }
        });

        video.srcObject = stream;

        // ✅ autoplay fix
        setTimeout(() => {
            video.play().catch(e => dbg("PLAY ERROR: " + e));
        }, 250);

        outputBox.textContent = "Camera active. Position your hand.";
        dbg("📷 Camera active");

    } catch (err) {
        outputBox.textContent = "Camera error!";
        dbg("Camera Error: " + err);
    }
};

/* Capture Hand */
window.captureHand = function () {

    if (!video.srcObject) {
        outputBox.textContent = "Camera not active!";
        return;
    }

    const c = palmCanvas;
    const ctx = c.getContext("2d");

    c.width = video.videoWidth;
    c.height = video.videoHeight;

    ctx.drawImage(video, 0, 0);

    lastImageData = ctx.getImageData(0, 0, c.width, c.height);

    palmBox.style.display = "block";
    outputBox.textContent = "Palm captured ✔ Starting analysis…";
    dbg("📸 Hand image captured");

    runPalmAnalysis(lastImageData);
};

/* MASTER REAL AI ANALYSIS ENGINE */
async function runPalmAnalysis(imageData) {
    try {
        dbg("🔍 Starting REAL palm analysis…");

        dbg("📦 Loading true-palm-8lines.js…");
        const trueMod = await import("./analysis/true-palm-8lines.js");

        const result = await trueMod.runTruePalmAI(imageData);
        dbg("🌿 Real Palm AI Extracted:");
        dbg(JSON.stringify(result.lines));

        outputBox.textContent = "Lines extracted ✔ Generating AI report…";

        dbg("📄 Loading true-report.js…");
        const repMod = await import("./analysis/true-report.js");

        const report = repMod.generateTrueReport({
            user: userData,
            palm: result.palm,
            lines: result.lines
        });

        dbg("✔ REPORT READY");
        outputBox.textContent = report;

    } catch (err) {
        dbg("FINAL ERROR: " + err);
        outputBox.textContent = "Error during analysis!";
    }
}
