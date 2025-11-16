// === INIT LANGUAGE SELECT ===
window.onload = () => {
    const sel = document.getElementById("langSelect");
    const langs = [
        "Sinhala", "Tamil", "English",
        "Hindi", "Japanese", "Chinese", "Thai",
        "Spanish", "French", "Arabic", "Russian",
        "German", "Korean", "Portuguese", "Indonesian",
        "Malay", "Italian", "Bengali", "Turkish"
    ];

    langs.forEach(l => {
        const opt = document.createElement("option");
        opt.value = l;
        opt.textContent = l;
        sel.appendChild(opt);
    });

    sel.value = "Sinhala";
};


// === START CAMERA ===
window.startCamera = async function () {
    const video = document.getElementById("video");

    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" }
        });

        video.srcObject = stream;
        video.play();

        document.getElementById("output").textContent =
            "Camera started. Align your palm with the guide.";

    } catch (err) {
        document.getElementById("output").textContent =
            "Camera blocked or unavailable.";
        console.error(err);
    }
};


// === CAPTURE PALM ===
window.captureHand = function () {
    const video = document.getElementById("video");
    const canvas = document.getElementById("palmCanvas");
    const box = document.getElementById("palmPreviewBox");
    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    box.style.display = "block";

    document.getElementById("output").textContent =
        "🧠 Processing palm…";

    // Send to AI Processor
    analyzePalm(canvas);
};
