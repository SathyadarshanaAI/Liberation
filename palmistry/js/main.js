import { renderPalmLines3D } from "./lines-3d.js";

const hands = ["left", "right"];
let streams = {};

for (const side of hands) {
  const vid = document.getElementById(`vid${cap(side)}`);
  const canvas = document.getElementById(`canvas${cap(side)}`);
  const ctx = canvas.getContext("2d");

  document.getElementById(`startCam${cap(side)}`).onclick = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      vid.srcObject = stream;
      streams[side] = stream;
      document.getElementById("status").textContent = `📷 ${side} camera active`;
    } catch (e) {
      document.getElementById("status").textContent = "⚠️ Camera access blocked: " + e.message;
    }
  };

  document.getElementById(`capture${cap(side)}`).onclick = () => {
    if (!streams[side]) return alert("Start camera first!");
    ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);
    vid.pause();
    document.getElementById("status").textContent = `📸 ${side} hand captured`;
  };

  document.getElementById(`analyze${cap(side)}`).onclick = async () => {
    document.getElementById("status").textContent = `🧠 Analyzing ${side} hand...`;
    const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
    await renderPalmLines3D(frame, canvas);
    document.getElementById("status").textContent = "✨ 3D Analysis Complete!";
  };
}

function cap(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
