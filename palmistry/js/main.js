// 🕉️ Sathyadarshana Quantum Palm Analyzer · V28.5 Serenity Focus Edition
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
    status.textContent = "⚠️ Camera failed. Try enabling permissions.";
    alert("Please enable camera permission in your browser and refresh.");
  }
}

// 🧩 Serenity Glow Detection
export async function detectPalmEdges(frame, canvas) {
  const src = cv.matFromImageData(frame);
  const hsv = new cv.Mat();
  const mask = new cv.Mat();
  const res = new cv.Mat();

  // Convert to HSV and detect skin tone area
  cv.cvtColor(src, hsv, cv.COLOR_RGBA2RGB);
  cv.cvtColor(hsv, hsv, cv.COLOR_RGB2HSV);
  const low = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), [0, 20, 60, 0]);
  const high = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), [50, 255, 255, 255]);
  cv.inRange(hsv, low, high, mask);

  // Apply mask to keep only hand area
  cv.bitwise_and(src, src, res, mask);

  // Convert to grayscale and enhance contrast
  const gray = new cv.Mat();
  cv.cvtColor(res, gray, cv.COLOR_RGB2GRAY);
  cv.equalizeHist(gray, gray);

  // Adaptive Canny Edge detection
  const edges = new cv.Mat();
  const threshold1 = 60;
  const threshold2 = 120;
  cv.Canny(gray, edges, threshold1, threshold2);

  // Morphological dilation to make lines thicker
  const kernel = cv.Mat.ones(2, 2, cv.CV_8U);
  cv.dilate(edges, edges, kernel);

  // Glow effect: blue color edges on black
  const colorEdges = new cv.Mat.zeros(edges.rows, edges.cols, cv.CV_8UC3);
  for (let i = 0; i < edges.rows; i++) {
    for (let j = 0; j < edges.cols; j++) {
      if (edges.ucharPtr(i, j)[0] > 0) {
        colorEdges.ucharPtr(i, j)[0] = 255; // Blue
        colorEdges.ucharPtr(i, j)[1] = 255; // Cyan
        colorEdges.ucharPtr(i, j)[2] = 255; // White glow
      }
    }
  }

  // Display serenity view
  cv.imshow(canvas, colorEdges);

  // Clean up
  src.delete(); hsv.delete(); mask.delete(); res.delete();
  gray.delete(); edges.delete(); kernel.delete(); colorEdges.delete();

  return true;
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
        "🧘 Analyzing Serenity Energy...";

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
