// === CAMERA START FUNCTION ===
export async function startCamera() {
  const video = document.getElementById("video");
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" }
    });
    video.srcObject = stream;
    await video.play();

    document.getElementById("handMsg").textContent = "Align your palm inside the frame.";

    console.log("📷 Camera started");
  } catch (err) {
    console.error("Camera error:", err);
    document.getElementById("handMsg").textContent = "Camera blocked. Allow permissions.";
  }
}

// === HAND CAPTURE FUNCTION ===
export function captureHand() {
  const video = document.getElementById("video");
  const canvas = document.getElementById("palmPreview");
  const box = document.getElementById("palmPreviewBox");
  const ctx = canvas.getContext("2d");

  // Set canvas size = video size
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  // Draw single frame
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  box.style.display = "block";
  document.getElementById("output").textContent =
    "🧠 Scan complete.\nInterpreting palm lines... (AI module loading...)";

  console.log("🖐️ Hand captured");
}
