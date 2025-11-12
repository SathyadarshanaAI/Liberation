// =============================
// 🧘 main.js — V29.2 Serenity Fixed Build
// =============================

import { renderPalmLines3D } from "./lines-3d.js";

const hands = ["left", "right"];
let streams = {};
let cvReady = false;

// ✅ Wait until OpenCV is fully ready
function waitForOpenCV() {
  return new Promise((resolve) => {
    const check = setInterval(() => {
      if (window.cv && cv.Mat) {
        clearInterval(check);
        cvReady = true;
        console.log("✅ OpenCV fully ready.");
        document.getElementById("status").textContent = "🔍 OpenCV Ready";
        resolve();
      }
    }, 500);
  });
}

// 🧘 Sinhala Voice Feedback
function speak(txt) {
  if (!window.speechSynthesis) return;
  const u = new SpeechSynthesisUtterance(txt);
  u.lang = "si-LK";
  u.pitch = 1;
  u.rate = 1;
  speechSynthesis.speak(u);
}

// 🪷 Capitalize
function cap(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// 🧠 MAIN LOOP
for (const side of hands) {
  const video = document.getElementById(`vid${cap(side)}`);
  const canvas = document.getElementById(`canvas${cap(side)}`);
  const ctx = canvas.getContext("2d");

  // 🎥 Start Camera
  document.getElementById(`startCam${cap(side)}`).onclick = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      video.srcObject = stream;
      streams[side] = stream;
      document.getElementById("status").textContent = `📷 ${side.toUpperCase()} camera active`;
    } catch (err) {
      document.getElementById("status").textContent = `⚠️ Camera error: ${err.message}`;
    }
  };

  // 📸 Capture Frame
  document.getElementById(`capture${cap(side)}`).onclick = async () => {
    if (!streams[side]) return alert("Start camera first!");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    video.pause();
    document.getElementById("status").textContent = `🧊 ${side} hand captured`;
  };

  // 🔮 Analyze 3D Palm
  document.getElementById(`analyze${cap(side)}`).onclick = async () => {
    if (!cvReady) {
      await waitForOpenCV();
    }

    document.getElementById("status").textContent = `🧠 Analyzing ${side} hand...`;

    const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
    if (!frame) {
      alert("Please capture your hand first!");
      return;
    }

    // 🪶 Call AI Render
    await renderPalmLines3D(frame, canvas);

    // 📜 Simple Report
    const mini = `Life line: strong\nHeart line: clear\nFate line: visible\nHead line: balanced\nSun line: bright\nMercury line: creative\nHealth line: calm\nMarriage line: fine`;
    const deep = `Palm indicates a blend of stability and spiritual awareness.
Mental clarity meets compassion and inner peace.`;

    document.getElementById(`miniReport${cap(side)}`).textContent = mini;
    document.getElementById(`deepReport${cap(side)}`).textContent = deep;

    // 🗣️ Voice Feedback
    const voice =
      side === "left"
        ? "ඔයාගේ වම් අතේ රේඛා සෞඛ්‍යය සහ මනෝ ශක්තිය පෙන්වයි."
        : "ඔයාගේ දකුණු අතේ රේඛා විශ්වාස සහ නායකත්වය පෙන්වයි.";

    speak(voice);
    document.getElementById("status").textContent = "✨ AI 3D Palm Analysis Complete!";
  };
}
