import { detectPalmEdges } from "./edgeLines.js";
import { analyzePalm } from "./brain.js";

const hands = ["left", "right"];
let streams = {};

for (const side of hands) {
  const vid = document.getElementById(`vid${cap(side)}`);
  const canvas = document.getElementById(`canvas${cap(side)}`);
  const ctx = canvas.getContext("2d");

  // ✅ Start camera
  document.getElementById(`startCam${cap(side)}`).onclick = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      vid.srcObject = stream;
      streams[side] = stream;
      document.getElementById("status").textContent = `📷 ${side.toUpperCase()} camera active`;
    } catch (e) {
      document.getElementById("status").textContent = "⚠️ Camera error: " + e.message;
    }
  };

  // ✅ Capture Frame
  document.getElementById(`capture${cap(side)}`).onclick = () => {
    if (!streams[side]) return alert("Start camera first!");
    ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);
    vid.pause();
    document.getElementById("status").textContent = `📸 ${side} hand captured`;
  };

  // ✅ Analyze Palm
  document.getElementById(`analyze${cap(side)}`).onclick = async () => {
    const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
    document.getElementById("status").textContent = `🧠 Analyzing ${side} hand...`;

    const edges = await detectPalmEdges(frame, canvas);
    const reports = analyzePalm(edges);

    document.getElementById(`miniReport${cap(side)}`).textContent = reports.mini;
    document.getElementById(`deepReport${cap(side)}`).textContent = reports.deep;

    speak(reports.voice);
    document.getElementById("status").textContent = "✨ Analysis Complete!";
  };
}

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
