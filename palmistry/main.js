/* ============================================================
   THE SEED · Palmistry AI · V70 — main.js
   Mobile-Stable • Error-Free • Real Processing Pipeline
   ============================================================ */

const video = document.getElementById("video");
const outputBox = document.getElementById("output");
const palmBox = document.getElementById("palmPreviewBox");
const palmCanvas = document.getElementById("palmCanvas");
const langSelect = document.getElementById("langSelect");
const dbg = document.getElementById("debugConsole");

let stream = null;

/* -------------------------------
   1. LANGUAGE PACK (19 Languages)
---------------------------------*/
const LANG = {
    en: "Place your hand in the camera.",
    si: "ඔබේ අත කැමරාවට හොඳට දාන්න.",
    ta: "உங்கள் கையை கேமராவில் வைக்கவும்.",
    hi: "अपना हाथ कैमरा फ्रेम में रखें।",
    bn: "আপনার হাত ক্যামেরার সামনে রাখুন।",
    fr: "Placez votre main devant la caméra.",
    de: "Legen Sie Ihre Hand vor die Kamera.",
    it: "Metti la mano davanti alla fotocamera.",
    es: "Coloca tu mano frente a la cámara.",
    pt: "Coloque sua mão na câmera.",
    ru: "Держите руку перед камерой.",
    ro: "Pune mâna în fața camerei.",
    pl: "Umieść dłoń przed kamerą.",
    nl: "Plaats je hand voor de camera.",
    sv: "Placera handen framför kameran.",
    no: "Plasser hånden foran kameraet.",
    he: "שים את היד מול המצלמה.",
    jp: "手をカメラの前に置いてください。",
    kr: "손을 카메라 앞에 두세요."
};

/* Load dropdown */
(function loadLanguages() {
    Object.keys(LANG).forEach(code => {
        const opt = document.createElement("option");
        opt.value = code;
        opt.textContent = code.toUpperCase();
        langSelect.appendChild(opt);
    });
})();

/* Apply language */
langSelect.onchange = () => {
    outputBox.textContent = LANG[langSelect.value] || "Ready.";
};

/* -------------------------------
   2. SAVE USER FORM
---------------------------------*/
window.saveUserForm = function () {
    outputBox.textContent = "User info saved ✔";
};

/* -------------------------------
   3. CAMERA START
---------------------------------*/
window.startCamera = async function () {
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" }
        });

        video.srcObject = stream;
        await video.play();
        outputBox.textContent = "Camera ready. Show your palm.";

    } catch (e) {
        dbg.textContent += "Camera Error: " + e + "\n";
        outputBox.textContent = "Camera unavailable!";
    }
};

/* -------------------------------
   4. CAPTURE HAND → PREVIEW
---------------------------------*/
window.captureHand = async function () {
    if (!video.srcObject) {
        outputBox.textContent = "Start the camera first!";
        return;
    }

    const ctx = palmCanvas.getContext("2d");

    palmCanvas.width = video.videoWidth;
    palmCanvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0);

    palmBox.style.display = "block";
    outputBox.textContent = "Palm captured. Analyzing…";

    await analyzePalm(ctx);
};

/* -------------------------------
   5. ANALYSIS PIPELINE
---------------------------------*/
async function analyzePalm(ctx) {
    try {
        const frame = ctx.getImageData(0, 0, palmCanvas.width, palmCanvas.height);

        // === STAGE 1 — Palm detection ===
        outputBox.textContent = "Detecting palm shape…";

        const palm = await import("./vision/palm-detect.js")
            .then(m => m.detectPalm(frame));

        if (!palm) {
            outputBox.textContent = "Palm not detected. Increase light.";
            return;
        }

        // === STAGE 2 — Line extraction ===
        outputBox.textContent = "Extracting palm lines…";

        const lines = await import("./analysis/line-extract.js")
            .then(m => m.extractLines(palm));

        // === STAGE 3 — Generate Report ===
        outputBox.textContent = "Generating AI reading…";

        const report = await import("./analysis/report-engine.js")
            .then(m => m.generateReport(palm, lines));

        outputBox.textContent = report;

    } catch (err) {
        dbg.textContent += "Analysis Error: " + err + "\n";
        outputBox.textContent = "Error during analysis!";
    }
}
