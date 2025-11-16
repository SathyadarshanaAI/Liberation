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
            "Camera started. Align your hand.";

        console.log("📷 Camera ready.");

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

    // Set size
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw camera frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Show preview
    box.style.display = "block";

    // Draw simple guide lines
    ctx.strokeStyle = "cyan";
    ctx.lineWidth = 3;
    ctx.shadowColor = "cyan";
    ctx.shadowBlur = 15;

    // Basic sample palm lines (placeholder)
    ctx.beginPath();
    ctx.moveTo(canvas.width * 0.2, canvas.height * 0.7);
    ctx.lineTo(canvas.width * 0.5, canvas.height * 0.4);
    ctx.lineTo(canvas.width * 0.8, canvas.height * 0.7);
    ctx.stroke();

    document.getElementById("output").textContent =
        "🧠 Palm captured.\nAnalyzing major lines... (demo)";

    console.log("🖐️ Palm captured.");
};
