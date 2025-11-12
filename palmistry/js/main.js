// 🕉️ Sathyadarshana Quantum Palm Analyzer · V28.2 Serenity Clarity Build
// ============================================================

// === 🧠 Import the Edge Analyzer ===
import { detectPalmEdges } from "./edgeLines.js";

// === 🪄 Helper Function ===
function cap(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// === 🌐 Wait for OpenCV to Load ===
async function waitForOpenCV() {
  return new Promise((resolve) => {
    const check = setInterval(() => {
      if (window.cv && cv.Mat) {
        clearInterval(check);
        resolve(true);
      }
    }, 500);
  });
}

await waitForOpenCV();
document.getElementById("status").textContent = "🧠 OpenCV Ready";

// === 🎥 Initialize Camera ===
async function startCamera(side, preferBack = true) {
  const video = document.getElementById(`vid${cap(side)}`);
  const status = document.getElementById("status");

  try {
    await navigator.mediaDevices.getUserMedia({ video: true });

    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter((d) => d.kind === "videoinput");

    if (videoDevices.length === 0)
      throw new Error("No camera detected on this device.");

    // Try to pick back camera
    let chosenDeviceId = videoDevices[0].deviceId;
    if (preferBack && videoDevices.length > 1) {
      const backCam = videoDevices.find((d) =>
        d.label.toLowerCase().includes("back")
      );
      if (backCam) chosenDeviceId = backCam.deviceId;
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { deviceId: chosenDeviceId },
      audio: false,
    });

    if (video.srcObject) video.srcObject.getTracks().forEach((t) => t.stop());
    video.srcObject = stream;
    await video.play();

    status.textContent = `📷 ${cap(side)} camera active`;
    console.log(`✅ ${side} camera started successfully.`);
  } catch (err) {
    console.error("⚠️ Camera start error:", err);
    alert("Please enable camera permission in browser settings.");
    status.textContent = `⚠️ ${err.message}`;
  }
}

// === 📸 Capture and Analyze Logic ===
const hands = ["left", "right"];
for (const side of hands) {
  const video = document.getElementById(`vid${cap(side)}`);
  const canvas = document.getElementById(`canvas${cap(side)}`);
  const ctx = canvas.getContext("2d");

  // Start Camera Button
  document
    .getElementById(`startCam${cap(side)}`)
    .addEventListener("click", () => startCamera(side));

  // Capture Button
  document
    .getElementById(`capture${cap(side)}`)
    .addEventListener("click", () => {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.style.display = "block";
      video.pause();
      document.getElementById("status").textContent = `📸 ${side} captured`;
    });

  // Analyze Button
  document
    .getElementById(`analyze${cap(side)}`)
    .addEventListener("click", async () => {
      document.getElementById("status").textContent = `🧠 Analyzing ${side} hand...`;

      const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
      try {
        await detectPalmEdges(frame, canvas);
      } catch (err) {
        console.error("Edge detection failed:", err);
        return;
      }

      // === ✨ AI Reports (Sample Logic) ===
      const mini = `Life line: deep and steady
Heart line: balanced curve
Fate line: clearly visible`;
      const deep = `Your palm reveals a calm but determined spirit.
Steady energy flow indicates inner harmony, persistence and wisdom.`;

      document.getElementById(`miniReport${cap(side)}`).textContent = mini;
      document.getElementById(`deepReport${cap(side)}`).textContent = deep;

      // === 🗣️ Voice Narration (Sinhala) ===
      const msg =
        side === "left"
          ? "ඔයාගේ වම් අතේ රේඛා පිරිසිදුයි. නිවන් සන්සුන් ශක්තියක් පෙන්වයි."
          : "ඔයාගේ දකුණු අතේ රේඛා විශ්වාස සහ නායකත්ව ගුණ පෙන්වයි.";
      const u = new SpeechSynthesisUtterance(msg);
      u.lang = "si-LK";
      u.pitch = 1;
      u.rate = 1;
      speechSynthesis.speak(u);

      document.getElementById("status").textContent =
        "✨ AI Serenity Analysis Complete!";
    });
}
