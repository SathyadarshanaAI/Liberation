/* ===============================
   THE SEED · Palmistry Engine · V120.0
   Final Stable Controller (No Legacy Files)
   =============================== */

console.log("🌿 THE SEED Palmistry Engine Loaded · V120.0");

const video = document.getElementById("video");
const outputBox = document.getElementById("output");
const palmBox = document.getElementById("palmPreviewBox");
const palmCanvas = document.getElementById("palmCanvas");
const debugConsole = document.getElementById("debugConsole");
const langSelect = document.getElementById("langSelect");

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

window.onunhandledrejection = function (e) {
    dbg("🚫 PROMISE ERROR: " + JSON.stringify(e.reason));
};

/* Load languages */
(function loadLanguages() {
    ["EN", "SI", "TA", "HI", "BN"].forEach(l => {
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

    dbg("📝 User profile saved");
    dbg(JSON.stringify(userData));
    outputBox.textContent = "User profile saved ✔ Ready for scanning.";
};

/* Start Camera */
window.startCamera = async function () {
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" }
        });

        video.srcObject = stream;
        await video.play();

        outputBox.textContent = "Camera active ✔ Position your hand.";
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
    outputBox.textContent = "Hand captured ✔ Starting REAL analysis…";
    dbg("📸 Hand image captured");

    runPalmAnalysis(lastImageData);
};

/* === THE SEED MASTER ANALYSIS PIPELINE === */
async function runPalmAnalysis(imageData) {
    try {
        dbg("🔍 Starting THE SEED AI Analysis…");

        /* 1 — Load Engines (THE SEED) */
        dbg("📦 Loading Engines…");

        const geoMod   = await import("./analysis/palm-geometry.js");
        const lineMod  = await import("./analysis/palm-lines.js");
        const mountMod = await import("./analysis/palm-mounts.js");
        const auraMod  = await import("./analysis/palm-aura.js");
        const repMod   = await import("./analysis/palm-report.js");

        /* 2 — Run Engines */
        const geometry = geoMod.detectPalmGeometry(video, palmCanvas);
        const lines    = lineMod.extractPalmLines(palmCanvas);
        const mounts   = mountMod.analyzeMounts(palmCanvas);
        const aura     = auraMod.scanAura(palmCanvas);

        dbg("🌿 Extracted Lines: " + JSON.stringify(lines.lines));
        dbg("🌄 Mounts: " + JSON.stringify(mounts.mounts));
        dbg("✨ Aura: " + JSON.stringify(aura
