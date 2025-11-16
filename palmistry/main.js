// === LANGUAGE LOADER ===
window.onload = () => {
    const sel = document.getElementById("langSelect");
    const langs = [
        "Sinhala", "Tamil", "English",
        "Hindi", "Japanese", "Chinese", "Arabic",
        "Spanish", "French", "Russian", "German",
        "Korean", "Portuguese", "Indonesian", "Malay", "Italian"
    ];
    langs.forEach(l => {
        const opt = document.createElement("option");
        opt.value = l; opt.textContent = l;
        sel.appendChild(opt);
    });
    sel.value = "Sinhala";
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

    } catch (err) {
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

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    document.getElementById("palmPreviewBox").style.display = "block";
    document.getElementById("output").textContent = "Analyzing palm...";

    analyzePalm(canvas);
};
