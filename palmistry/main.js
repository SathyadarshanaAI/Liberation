/* ===============================
   THE SEED · Palmistry AI · V70
   Main Runtime Controller
   =============================== */

console.log("🌿 THE SEED Palmistry Engine Loaded");

const video = document.getElementById("video");
const outputBox = document.getElementById("output");
const palmBox = document.getElementById("palmPreviewBox");
const palmCanvas = document.getElementById("palmCanvas");
const langSelect = document.getElementById("langSelect");
const debugConsole = document.getElementById("debugConsole");

let stream = null;
let userData = {};
let lastImageData = null;

/* DEBUGGER SAFE-PRINT */
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

/* UNHANDLED PROMISE ERRORS */
window.onunhandledrejection = function (e) {
    dbg("🚫 PROMISE ERROR: " + JSON.stringify(e.reason));
};

/* -----------------------------
   Language Pack Loader
------------------------------ */
(function loadLanguages() {
    const langs = ["EN", "SI", "TA", "HI", "BN"];
    langs.forEach(l => {
        let o = document.createElement("option");
        o.value = l.toLowerCase();
        o.textContent = l;
        langSelect.appendChild(o);
    });
})();

/* -----------------------------
   Save User Details
------------------------------ */
window.saveUserForm = function () {
    userData = {
        name: document.getElementById("userName").value,
        gender: document.getElementById("userGender").value,
        dob: document.getElementById("userDOB").value,
        country: document.getElementById("userCountry").value,
        hand: document.getElementById("handPref").value,
        note: document.getElementById("userNote").value
    };

    dbg("User profile saved:");
    dbg(JSON.stringify(userData));

    outputBox.textContent = "User profile saved. Scan your palm now.";
};

/* -----------------------------
   Open Camera
------------------------------ */
window.startCamera = async function () {
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" }
        });

        video.srcObject = stream;
        await video.play();

        outputBox.textContent = "Camera active. Position your hand.";

    } catch (err) {
        outputBox.textContent = "Camera error!";
        dbg("Camera Error: " + err);
    }
};

/* -----------------------------
   Capture Hand
------------------------------ */
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

    runPalmAnalysis(lastImageData);
};

/* -----------------------------
   Palmistry AI — MASTER ENGINE
------------------------------ */
async function runPalmAnalysis(imageData) {
    try {
        dbg("🔍 Starting palm analysis…");

        /* --------- 1 — PALM DETECT --------- */
        dbg("Loading palm-detect.js…");
        const palmMod = await import("./analysis/palm-detect.js")
            .catch(e => { dbg("❌ ERROR loading palm-detect.js"); dbg(e); throw e; });

        const palmData = await palmMod.detectPalm(imageData)
            .catch(e => { dbg("❌ detectPalm FAILED"); dbg(e); throw e; });

        outputBox.textContent = "Palm analyzed ✔ Extracting main lines…";

        /* --------- 2 — LINE EXTRACT --------- */
        dbg("Loading line-extract.js…");
        const lineMod = await import("./analysis/line-extract.js")
            .catch(e => { dbg("❌ ERROR loading line-extract.js"); dbg(e); throw e; });

        const lines = await lineMod.extractLines(palmData)
            .catch(e => { dbg("❌ extractLines FAILED"); dbg(e); throw e; });

        outputBox.textContent = "Lines extracted ✔ Generating AI report…";

        /* --------- 3 — REPORT ENGINE --------- */
        dbg("Loading report-engine.js…");
        const repMod = await import("./analysis/report-engine.js")
            .catch(e => { dbg("❌ ERROR loading report-engine.js"); dbg(e); throw e; });

        const report = await repMod.generateReport({
            user: userData,
            palm: palmData,
            lines: lines
        }).catch(e => { dbg("❌ generateReport FAILED"); dbg(e); throw e; });

        dbg("✔ REPORT READY");
        outputBox.textContent = report;

    } catch (err) {
        outputBox.textContent = "Error during analysis!";
        dbg("FINAL ERROR: " + err);
    }
}
