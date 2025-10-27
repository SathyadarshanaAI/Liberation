// modules/camera.js
export async function startCamera(video, msg) {
  try {
    if (!navigator.mediaDevices?.getUserMedia) {
      msg.textContent = "❌ Camera not supported on this device.";
      msg.className = "error";
      return null;
    }

    const constraints = {
      video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
      audio: false
    };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = stream;

    // Ensure autoplay works on mobile
    video.onloadeddata = () => {
      video.play();
      msg.textContent = "✅ Camera active. Place your hand in bright light.";
      msg.className = "";
    };

    return stream;
  } catch (err) {
    console.error("Camera error:", err);
    msg.textContent = "⚠️ Camera access failed: " + err.message;
    msg.className = "error";

    if (err.name === "NotAllowedError") {
      alert("Please allow camera access:\nTap 🔒 → Site Settings → Camera → Allow");
    }
    return null;
  }
}

export function captureFrame(video) {
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth || 640;
  canvas.height = video.videoHeight || 480;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}
