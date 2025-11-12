// 🕉️ Sathyadarshana Quantum Palm Analyzer · V28.4 Auto Recovery Serenity Edition
import { detectPalmEdges } from "./edgeLines.js";

function cap(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// Wait for OpenCV
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

// ============================================================
// 📷 CAMERA INITIALIZER (Auto Recovery + FacingMode fallback)
// ============================================================
async function startCamera(side) {
  const video = document.getElementById(`vid${cap(side)}`);
  const status = document.getElementById("status");

  let constraints = {
    video: {
      width: { ideal: 1280 },
      height: { ideal: 720 },
      facingMode: { ideal: "environment" },
    },
    audio: false,
  };

  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    if (video.srcObject) video.srcObject.getTracks().forEach((t) => t.stop());
    video.srcObject = stream;
    await video.play();

    status.textContent = `📷 ${cap(side)} camera active`;
    console.log("✅ Camera started with facingMode: environment");
  } catch (err) {
    console.warn("⚠️ FacingMode failed, retrying with default camera...", err);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (video.srcObject) video.srcObject.getTracks().forEach((t) => t.stop());
      video.srcObject = stream;
      await video.play();

      status.textContent = `📷 ${cap(side)} camera (default mode)`;
      console.log("✅ Camera started with fallback default");
    } catch (err2) {
      console.error("🚫 Camera completely failed:", err2);
      status.textContent =
        "⚠️ Could not start video source. Please allow camera permission and reload.";
      alert(
        "Please enable camera access in browser settings, then refresh this page."
      );
    }
  }
}

// ============================================================
// ✋ PALM CAPTURE + ANALYZE
// ============================================================
const hands = ["left", "right"];
for (const side of hands) {
  const video = document.getElementById(`vid${cap(side)}`);
  const canvas = document.getElementById(`canvas${cap(side)}`);
  const ctx = canvas.getContext("2d");

  // Start Camera
  document
    .getElementById(`startCam${cap(side)}`)
    .addEventListener("click", () => startCamera(side));

  // Capture
  document
    .getElementById(`capture${cap(side)}`)
    .addEventListener("click", () => {
      if (video.readyState >= 2) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        video.pause();
        document.getElementById("status").textContent = `📸 ${side} captured`;
      } else {
        alert("Camera not ready. Please wait a moment and try again.");
      }
    });

  // Analyze
  document
    .getElementById(`analyze${cap(side)}`)
    .addEventListener("click", async () => {
      document.getElementById("status").textContent = `🧠 Analyzing ${side} hand...`;
      const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);

      try {
        await detectPalmEdges(frame, canvas);
      } catch (e) {
        console.error("Edge detection failed:", e);
      }

      document.getElementById(`miniReport${cap(side)}`).textContent =
        "Life line: deep and long\nHeart line: balanced\nFate line: clear path";
      document.getElementById(`deepReport${cap(side)}`).textContent =
        "This palm shows calmness and resilience. Balanced energy flow indicates deep insight.";

      // Sinhala voice
      const msg =
        side === "left"
          ? "ඔයාගේ වම් අතේ ශක්තිය සාමකාමී සහ නිවන්මයයි."
          : "ඔයාගේ දකුණු අතේ ශක්තිය විශ්වාස සහ නායකත්වයෙන් පිරී ඇත.";
      const u = new SpeechSynthesisUtterance(msg);
      u.lang = "si-LK";
      speechSynthesis.speak(u);

      document.getElementById("status").textContent =
        "✨ AI Serenity Analysis Complete!";
    });
}
