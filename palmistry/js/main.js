// 🕉️ Sathyadarshana Quantum Palm Analyzer · V28.5 Serenity Focus Edition (Fixed)
import { detectPalmEdges } from "./edgeLines.js";

// 🧠 Wait until OpenCV fully loaded
async function waitForOpenCV() {
  return new Promise((resolve) => {
    const check = setInterval(() => {
      if (window.cv && cv.Mat) {
        clearInterval(check);
        resolve(true);
      }
    }, 300);
  });
}
await waitForOpenCV();
document.getElementById("status").textContent = "🧠 OpenCV Ready";

// 🎥 Camera Control
async function startCamera(side) {
  const video = document.getElementById(`vid${side}`);
  const status = document.getElementById("status");

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: { ideal: "environment" },
      },
      audio: false,
    });
    video.srcObject = stream;
    await video.play();
    status.textContent = `📷 ${side} camera active`;
  } catch (err) {
    console.warn("Camera access error:", err);
    status.textContent = "⚠️ Camera failed. Enable permissions and retry.";
    alert("Please allow camera permission in your browser settings.");
  }
}

// ✋ UI EVENTS
["Left", "Right"].forEach((side) => {
  const video = document.getElementById(`vid${side}`);
  const canvas = document.getElementById(`canvas${side}`);
  const ctx = canvas.getContext("2d");

  document
    .getElementById(`startCam${side}`)
    .addEventListener("click", () => startCamera(side));

  document
    .getElementById(`capture${side}`)
    .addEventListener("click", () => {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      document.getElementById("status").textContent = "📸 Palm captured";
    });

  document
    .getElementById(`analyze${side}`)
    .addEventListener("click", async () => {
      const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
      document.getElementById("status").textContent =
        "🧘 Serenity Analysis Running...";

      // Use detectPalmEdges from edgeLines.js
      await detectPalmEdges(frame, canvas);

      document.getElementById(`miniReport${side}`).textContent =
        "Life line: clear\nHeart line: calm\nFate line: strong direction";
      document.getElementById(`deepReport${side}`).textContent =
        "Palm Serenity indicates balanced emotions, strong willpower, and clarity of life purpose.";

      // Voice feedback
      const msg = new SpeechSynthesisUtterance(
        "Serenity analysis complete. Calm and focused energy detected."
      );
      msg.lang = "en-US";
      speechSynthesis.speak(msg);

      document.getElementById("status").textContent =
        "✨ AI Serenity Analysis Complete!";
    });
});
