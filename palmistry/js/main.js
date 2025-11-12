// ========================================
// 🕉️ main.js — V29.1 Serenity Stable Build
// ========================================

import { renderPalmLines3D } from "./lines-3d.js";

const hands = ["left", "right"];
let streams = {};

// Capitalize helper
function cap(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// 🔊 Sinhala voice feedback
function speak(text) {
  if (!window.speechSynthesis) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "si-LK";
  u.pitch = 1;
  u.rate = 1;
  speechSynthesis.speak(u);
}

// 🧠 Core loop for both hands
for (const side of hands) {
  const video = document.getElementById(`vid${cap(side)}`);
  const canvas = document.getElementById(`canvas${cap(side)}`);
  const ctx = canvas.getContext("2d");

  // ✅ Start camera
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

  // ✅ Capture frame
  document.getElementById(`capture${cap(side)}`).onclick = () => {
    if (!streams[side]) return alert("Start camera first!");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    video.pause(); // freeze video frame
    document.getElementById("status").textContent = `📸 ${side} hand captured`;
  };

  // ✅ Analyze captured hand
  document.getElementById(`analyze${cap(side)}`).onclick = async () => {
    document.getElementById("status").textContent = `🧠 Analyzing ${side} hand...`;

    // Get captured frame
    const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
    if (!frame) {
      alert("Please capture your hand first!");
      return;
    }

    // Render AI-based 3D Palm Visualization
    await renderPalmLines3D(frame, canvas);

    // Mock report (until AI Core connected)
    const mini = `Life line: strong\nHeart line: clear\nFate line: visible\nSun line: faint\nMercury line: soft\nHead line: balanced\nMarriage line: fine\nHealth line: steady`;
    const deep = `Palm indicates harmony between mind and emotion. 
Leadership energy balanced with empathy and intuition. 
Creativity shines through Sun and Mercury mounts.`;

    document.getElementById(`miniReport${cap(side)}`).textContent = mini;
    document.getElementById(`deepReport${cap(side)}`).textContent = deep;

    const voice =
      side === "left"
        ? "ඔයාගේ වම් අතේ රේඛා පැහැදිලියි. ඔබේ ආත්ම ශක්තිය ශක්තිමත්යි."
        : "ඔයාගේ දකුණු අතේ රේඛා නායකත්වය සහ විශ්වාසය පෙන්වයි.";

    speak(voice);
    document.getElementById("status").textContent = "✨ AI 3D Analysis Complete!";
  };
}
