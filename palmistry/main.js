// ======================================================
// 🟣 THE SEED · PALMISTRY AI · V50
// Full main.js with: Language System + Camera + Capture
// User Form Save + AnalyzePalm Hook
// ======================================================


// === LANGUAGE LOADER ===
window.onload = () => {
    const sel = document.getElementById("langSelect");
    const langs = [
        "Sinhala", "Tamil", "English",
        "Hindi", "Japanese", "Chinese", "Arabic",
        "Spanish", "French", "Russian", "German",
        "Korean", "Portuguese", "Indonesian", "Malay",
        "Italian", "Turkish", "Dutch", "Thai"
    ];

    langs.forEach(l => {
        const opt = document.createElement("option");
        opt.value = l;
        opt.textContent = l;
        sel.appendChild(opt);
    });

    sel.value = "English"; // default
};



// === CAMERA START ===
window.startCamera = async function () {
    const video = document.getElementById("video");

    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" }
        });

        video.srcObject = stream;
        await video.play();

        document.getElementById("output").textContent =
            "Camera started. Align your palm.";
    }
    catch (err) {
        document.getElementById("output").textContent =
            "Camera permission denied.";
        console.error(err);
    }
};



// === CAPTURE PALM ===
window.captureHand = function () {
    const video = document.getElementById("video");
    const canvas = document.getElementById("palmCanvas");
    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth || 450;
    canvas.height = video.videoHeight || 600;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    document.getElementById("palmPreviewBox").style.display = "block";
    document.getElementById("output").textContent = "Analyzing palm...";

    analyzePalm(canvas, userData);  // user data passed
};



// ======================================================
// USER FORM SAVE SYSTEM
// ======================================================

let userData = {};

window.saveUserForm = function () {
    userData = {
        name: document.getElementById("userName").value.trim(),
        gender: document.getElementById("userGender").value.trim(),
        dob: document.getElementById("userDOB").value.trim(),
        country: document.getElementById("userCountry").value.trim(),
        hand: document.getElementById("handPref").value.trim(),
        note: document.getElementById("userNote").value.trim()
    };

    alert("User information saved successfully!");
};
