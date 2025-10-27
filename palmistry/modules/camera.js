// modules/camera.js
// ✅ Sathyadarshana Quantum Palm Analyzer · Camera Engine v2.3.1

export async function startCamera(video, msg) {
  try {
    // --- Check for available cameras ---
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cams = devices.filter(d => d.kind === "videoinput");

    if (cams.length === 0) {
      msg.textContent = "❌ No camera detected on this device.";
      msg.className = "error";
      return null;
    }

    // --- Prefer back camera if available ---
    const backCam = cams.find(c => /back|rear|environment/i.test(c.label));
    const selectedCam = backCam ? backCam.deviceId : cams[0].deviceId;

    // --- Open camera stream ---
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { deviceId: selectedCam ? { exact: selectedCam } : undefined },
      audio: false
    });

    video.srcObject = stream;
    await video.play();

    msg.textContent = "✅ Camera active. Hold your hand steady under good light.";
    msg.className = "";
    return stream;
  } catch (err) {
    console.error("Camera error:", err);
    msg.textContent = "⚠️ Camera access error: " + err.message;
    msg.className = "error";

    // --- Guide user if permission denied ---
    if (err.name === "NotAllowedError") {
      alert("Please allow camera access in your browser settings (tap lock icon → Site settings → Camera → Allow).");
    }
    return null;
  }
}

// --- Capture single frame to canvas ImageData ---
export function captureFrame(video) {
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth || 640;
  canvas.height = video.videoHeight || 480;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}
