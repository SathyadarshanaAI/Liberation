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

let stream = null;
let userData = {};
let lastImageData = null;

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

    console.log("User profile saved:", userData);
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
        console.log("Camera Error:", err);
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
        outputBox.textContent = "Analyzing palm shape…";

        // 1 — Palm Detect
        const palmMod = await import("./analysis/palm-detect.js");
        const palmData = await palmMod.detectPalm(imageData);

        outputBox.textContent = "Palm analyzed ✔ Extracting main lines…";

        // 2 — Line Extraction
        const lineMod = await import("./analysis/line-extract.js");
        const lines = await lineMod.extractLines(palmData);

        outputBox.textContent = "Lines extracted ✔ Generating AI report…";

        // 3 — Report Engine
        const repMod = await import("./analysis/report-engine.js");
        const report = await repMod.generateReport({
            user: userData,
            palm: palmData,
            lines: lines
        });

        outputBox.textContent = report;

    } catch (err) {
        outputBox.textContent = "Error during analysis!";
        console.log("Analysis Error:", err);
    }
}
