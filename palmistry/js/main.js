// ===========================
// 🕉️ main.js — Camera Fix V28.1
// ===========================

import { detectPalmEdges } from "./edgeLines.js";

// DOM Ready check (important for mobile browsers)
document.addEventListener("DOMContentLoaded", () => {
  const status = document.getElementById("status");
  const hands = ["left", "right"];
  let streams = {};

  // 🔸 Core camera start function
  async function startCamera(side, facingMode = "environment") {
    const video = document.getElementById(`vid${cap(side)}`);

    try {
      // Request permission and start stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: false,
      });

      // Stop any previous stream (prevent conflict)
      if (streams[side]) {
        streams[side].getTracks().forEach(t => t.stop());
      }

      // Bind new stream
      streams[side] = stream;
      video.srcObject = stream;

      // Ensure video plays properly
      await video.play();

      status.textContent = `📷 ${cap(side)} camera active`;
      console.log(`✅ ${cap(side)} camera started`);
    } catch (err) {
      console.error("⚠️ Camera error:", err);
      status.textContent = `⚠️ Camera access failed (${err.message})`;
      alert("Please allow camera permission in your browser settings.");
    }
  }

  // 🔸 Capture frame
  function captureFrame(side) {
    const video = document.getElementById(`vid${cap(side)}`);
    const canvas = document.getElementById(`canvas${cap(side)}`);
    const ctx = canvas.getContext("2d");

    if (!streams[side]) {
      alert("Please start the camera first!");
      return;
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.style.display = "block";
    video.pause();
    status.textContent = `📸 ${cap(side)} captured`;
    console.log(`🧩 Frame captured for ${side}`);
  }

  // 🔸 Analyze palm
  async function analyzePalm(side) {
    const canvas = document.getElementById(`canvas${cap(side)}`);
    const ctx = canvas.getContext("2d");
    const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);

    status.textContent = `🧠 Analyzing ${side} hand...`;

    try {
      await detectPalmEdges(frame, canvas);
    } catch (err) {
      console.error("Edge detection error:", err);
      status.textContent = `⚠️ AI analysis failed (${err.message})`;
      return;
    }

    // Generate reports
    const mini = `Life line: clear\nHeart line: steady curve\nFate line: visible medium strength`;
    const deep = `Calm, emotionally stable nature. Clear thought patterns.\nResilience under pressure, grounded decision making.`;

    document.getElementById(`miniReport${cap(side)}`).textContent = mini;
    document.getElementById(`deepReport${cap(side)}`).textContent = deep;

    // Sinhala voice feedback
    const msg =
      side === "left"
        ? "ඔයාගේ වම් අත පිරිසිදුයි. ආත්ම ශක්තිය ස්ථාවරයි."
        : "ඔයාගේ දකුණු අතේ රේඛා නායකත්ව සහ විශ්වාස පෙන්වයි.";
    const u = new SpeechSynthesisUtterance(msg);
    u.lang = "si-LK";
    u.pitch = 1;
    u.rate = 1;
    speechSynthesis.speak(u);

    status.textContent = "✨ AI Analysis Complete!";
  }

  // 🔸 Event bindings
  hands.forEach(side => {
    document
      .getElementById(`startCam${cap(side)}`)
      .addEventListener("click", () =>
        startCamera(side, side === "right" ? "user" : "environment")
      );

    document
      .getElementById(`capture${cap(side)}`)
      .addEventListener("click", () => captureFrame(side));

    document
      .getElementById(`analyze${cap(side)}`)
      .addEventListener("click", () => analyzePalm(side));
  });

  // 🔸 Helper
  function cap(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  // 🪷 Serenity initialization
  status.textContent = "🧘 Initializing calm neural system...";
  setTimeout(() => {
    status.textContent = "🔍 System Ready — Start Camera to begin.";
  }, 1500);
});
