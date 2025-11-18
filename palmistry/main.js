/* ============================================================
   THE SEED · Palmistry AI · V70
   main.js — Core Fusion Controller
   Systems:
   - Language Loader
   - User Info Save
   - Camera Engine (Fixed)
   - Palm Capture Engine
   - Analysis Pipeline
   - Debug Console Sync
=========================================================== */

/* ---------------- DOM References ---------------- */
const video = document.getElementById("video");
const outputBox = document.getElementById("output");
const palmPreviewBox = document.getElementById("palmPreviewBox");
const palmCanvas = document.getElementById("palmCanvas");
const debugConsole = document.getElementById("debugConsole");
const langSelect = document.getElementById("langSelect");

let stream = null;

/* ---------------- Language Pack ---------------- */
const LANG = {
    en: "Place your hand inside the frame.",
    si: "ඔබේ අත රාමුව තුළ තබන්න.",
    ta: "உங்கள் கையை கட்டமைப்புக்குள் வையுங்கள்.",
    hi: "अपना हाथ फ्रेम के अंदर रखें।",
    bn: "আপনার হাত ফ্রেমের ভিতরে রাখুন।",
    fr: "Placez votre main dans le cadre.",
    de: "Legen Sie Ihre Hand in den Rahmen.",
    it: "Metti la mano nella cornice.",
    es: "Coloca tu mano dentro el marco.",
    ru: "Поместите руку в рамку.",
    ne: "तपाईंको हात फ्रेमभित्र राख्नुहोस्।",
    my: "လက်ကိုဘောင်ထဲထည့်ပါ။",
    jp: "手をフレームの中に入れてください。",
    kr: "손을 프레임 안에 넣으세요।",
    th: "วางมือของคุณในกรอบ",
    id: "Tempatkan tangan Anda di dalam bingkai.",
    ar: "ضع يدك داخل الإطار.",
    he: "שים את ידך בתוך המסגרת."
};

/* ---------------- Load Language Options ---------------- */
(function loadLanguages() {
    Object.keys(LANG).forEach(code => {
        const opt = document.createElement("option");
        opt.value = code;
        opt.textContent = code.toUpperCase();
        langSelect.appendChild(opt);
    });
})();

/* ---------------- Save User Info ---------------- */
window.saveUserForm = function () {
    outputBox.textContent = "User info saved.";
};

/* ---------------- Start Camera ---------------- */
window.startCamera = async function () {

    outputBox.textContent = "Opening camera…";

    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" },
            audio: false
        });

        video.srcObject = stream;
        await video.play();

        outputBox.textContent = LANG[langSelect.value] || "Camera ready.";

    } catch (e) {
        debug("Camera Error: " + e.message);
        outputBox.textContent = "Camera failed to open!";
    }
};

/* ---------------- Capture Palm Image ---------------- */
window.captureHand = function () {

    if (!video.srcObject) {
        outputBox.textContent = "Camera not active!";
        return;
    }

    const ctx = palmCanvas.getContext("2d");
    palmCanvas.width = video.videoWidth;
    palmCanvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0);

    palmPreviewBox.style.display = "block";
    outputBox.textContent = "Palm captured. Analyzing…";

    runAnalysis();
};

/* ---------------- Debug Log Function ---------------- */
function debug(msg) {
    debugConsole.textContent += msg + "\n";
}

/* ---------------- Analysis Pipeline ---------------- */
async function runAnalysis() {

    const ctx = palmCanvas.getContext("2d");
    const frame = ctx.getImageData(0, 0, palmCanvas.width, palmCanvas.height);

    debug("Stage 1: Loading palm-detect…");

    try {
        const palmMod = await import("./vision/palm-detect.js");
        const palm = await palmMod.detectPalm(frame);

        debug("Palm detected ✔");

        debug("Stage 2: Loading line-extract…");

        const lineMod = await import("./vision/line-extract.js");
        const lines = await lineMod.detectLines(palm);

        debug("Lines extracted ✔");

        debug("Stage 3: Loading report engine…");

        const reportMod = await import("./report-engine.js");
        const report = reportMod.generateReport(palm, lines);

        outputBox.textContent = report;

        debug("Report generated ✔");

    } catch (err) {
        debug("Analysis Error: " + err.message);
        outputBox.textContent = "Analysis failed. Check lighting and try again.";
    }
}
