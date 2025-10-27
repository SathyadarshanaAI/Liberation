// 🕉️ Sathyadarshana · Quantum Palm Analyzer · Camera Core v2.2.4
export async function startCamera(video, msg) {
  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      msg.textContent = "❌ Camera not supported on this browser.";
      msg.className = "error";
      return null;
    }

    const constraints = {
      video: {
        facingMode: { ideal: "environment" },
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = stream;

    // --- play() fallback for Android autoplay restrictions ---
    const play = video.play();
    if (play !== undefined) {
      play.catch(e => {
        console.warn("Autoplay blocked:", e.message);
        msg.textContent = "⚠️ Tap video to start camera manually.";
        video.onclick = () => video.play();
      });
    }

    // --- ready check ---
    const waitReady = () =>
      new Promise(res => {
        if (video.readyState >= 2) res();
        else video.onloadeddata = res;
      });
    await waitReady();

    msg.textContent = "✅ Camera active. Place your hand steadily under bright light.";
    msg.className = "";
    return stream;
  } catch (err) {
    console.error("Camera error:", err);
    msg.textContent = "⚠️ Camera access failed: " + err.message;
    msg.className = "error";
    if (err.name === "NotAllowedError") {
      alert("Please allow camera permission:\nTap lock icon → Site settings → Camera → Allow.");
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
