/* THE SEED · Palmistry AI · V51 */
const video = document.getElementById("video");
const outputBox = document.getElementById("output");
const langSelect = document.getElementById("langSelect");
const palmBox = document.getElementById("palmPreviewBox");
const palmCanvas = document.getElementById("palmCanvas");
const dbg = document.getElementById("debugConsole");

let stream = null;

/* LANGUAGE PACK */
const LANG = {
    en: "Place your hand inside the guide.",
    si: "ඔබේ අත නිදර්ශනය තුළ තබන්න.",
    ta: "உங்கள் கையை வழிகாட்டியில் வைக்கவும்.",
    hi: "अपना हाथ गाइड के अंदर रखें।",
    bn: "আপনার হাত নির্দেশকের ভিতরে রাখুন।"
};

/* Load languages */
(function initLanguages(){
    Object.keys(LANG).forEach(k=>{
        const opt=document.createElement("option");
        opt.value=k;
        opt.textContent=k.toUpperCase();
        langSelect.appendChild(opt);
    });
})();

/* Save user info */
window.saveUserForm = function () {
    outputBox.textContent = "User info saved.";
};

/* Start camera */
window.startCamera = async function () {
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" }
        });
        video.srcObject = stream;
        await video.play();
    } catch (e) {
        dbg.textContent += "Camera Error: " + e + "\n";
    }
};

/* Capture frame */
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

    palmBox.style.display = "block";
    outputBox.textContent = "Palm captured. Ready for reading.";
};
