// === START CAMERA ===
window.startCamera = async function () {
    const video = document.getElementById("video");

    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" }
        });

        video.srcObject = stream;
        video.play();

        console.log("📷 Camera ready.");
        document.getElementById("output").textContent =
            "Camera started. Align your hand.";
    } 
    catch (err) {
        console.error("Camera error:", err);
        document.getElementById("output").textContent =
            "Camera blocked or unavailable.";
    }
};


// === CAPTURE HAND ===
window.captureHand = function () {
    const video = document.getElementById("video");

    // Create canvas
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    document.getElementById("output").textContent =
        "🧠 Hand captured.\nAI interpretation module loading...";

    console.log("🖐️ Palm captured.");
};
