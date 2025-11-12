// ===============================
// 🌌 main.js · V30.3 Stable Serenity Chain
// ===============================

import { renderPalmLines3D } from "./lines-3d.js";

const hands = ["left", "right"];
let streams = {};

for (const side of hands) {
  const vid = document.getElementById(`vid${cap(side)}`);
  const canvas = document.getElementById(`canvas${cap(side)}`);
  const ctx = canvas.getContext("2d");

  // ✅ Start camera
  document.getElementById(`startCam${cap(side)}`).onclick = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      vid.srcObject = stream;
      streams[side] = stream;
      document.getElementById("status").textContent = `📷 ${side.toUpperCase()} camera active`;
    } catch (e) {
      document.getElementById("status").textContent = "⚠️ Camera error: " + e.message;
    }
  };

  // ✅ Capture Frame (freeze the image)
  document.getElementById(`capture${cap(side)}`).onclick = () => {
    if (!streams[side]) {
      alert("Start camera first!");
      return;
    }
    ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);
    vid.pause();
    document.getElementById("status").textContent = `📸 ${side} hand captured`;
  };

  // ✅ Analyze Palm (run 3D line analyzer)
  document.getElementById(`analyze${cap(side)}`).onclick = async () => {
    const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
    document.getElementById("status").textContent = `🧠 Analyzing ${side} hand...`;

    try {
      await renderPalmLines3D(frame, canvas);
      document.getElementById("status").textContent = "✨ Analysis Complete!";
      document.getElementById(`miniReport${cap(side)}`).textContent =
        `Palm successfully analyzed (${side} hand).`;
      document.getElementById(`deepReport${cap(side)}`).textContent =
        `Detected major palm line structure and geometry for ${side} hand.\nReal-time mapping complete.`;
    } catch (err) {
      document.getElementById("status").textContent = "⚠️ Analysis failed: " + err.message;
    }
  };
}

function cap(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
