// ==========================
// 🧠 main.js — Serenity 3D Edition
// ==========================

import { renderPalmLines3D } from "./lines-3d.js";

// Available hands
const hands = ["left", "right"];
let streams = {};

for (const side of hands) {
  const vid = document.getElementById(`vid${cap(side)}`);
  const canvas = document.getElementById(`canvas${cap(side)}`);
  const ctx = canvas.getContext("2d");

  // 🎥 Start Camera
  document.getElementById(`startCam${cap(side)}`).onclick = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      vid.srcObject = stream;
      streams[side] = stream;
      document.getElementById("status").textContent = `📷 ${side.toUpperCase()} camera active`;
    } catch (e) {
      document.getElementById("status").textContent = "⚠️ Camera error: " + e.message;
    }
  };

  // 📸 Capture Frame
  document.getElementById(`capture${cap(side)}`).onclick = () => {
    if (!streams[side]) return alert("Start camera first!");
    ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);
    vid.pause();
    document.getElementById("status").textContent = `📸 ${side} hand captured`;
  };

  // 🧠 Analyze Palm
  document.getElementById(`analyze${cap(side)}`).onclick = async () => {
    document.getElementById("status").textContent = `🧠 Analyzing ${side} hand...`;
    const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // ✨ Draw smooth 3D palm lines (new AI render system)
    await renderPalmLines3D(frame, canvas);

    // 🪶 AI Mock Reports
    const mini = `Life line: steady\nHeart line: soft curve\nFate line: visible and bright`;
    const deep = `Palm indicates mental clarity, emotional balance and intuitive strength. 
Energy radiates evenly around the mount of Venus — suggesting resilience and wisdom.`;

    document.getElementById(`miniReport${cap(side)}`).textContent = mini;
    document.getElementById(`deepReport${cap(side)}`).textContent = deep;

    // 🎤 Voice Feedback
    const voice =
      side === "left"
        ? "ඔයාගේ වම් අතේ රේඛා පිරිසිදුයි. ආත්ම ශක්තිය පැහැදිලියි."
        : "ඔයාගේ දකුණු අතේ රේඛා විශ්වාස සහ නායකත්ව ගුණ පෙන්වයි.";

    speak(voice);
    document.getElementById("status").textContent = "✨ AI Analysis Complete!";
  };
}

// 🧩 Helper Functions
function cap(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function speak(text) {
  if (!window.speechSynthesis) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "si-LK";
  u.pitch = 1;
  u.rate = 1;
  speechSynthesis.speak(u);
}
