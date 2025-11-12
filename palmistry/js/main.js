import { drawQuantumPalm } from "./lines-3d.js";
import { analyzePalmEnergy } from "./brain.js";

function cap(s){ return s.charAt(0).toUpperCase() + s.slice(1); }

async function waitForCV() {
  return new Promise(resolve => {
    const timer = setInterval(() => {
      if (typeof cv !== "undefined" && cv.Mat) {
        clearInterval(timer);
        resolve();
      }
    }, 500);
  });
}

async function startSystem() {
  const status = document.getElementById("status");
  status.textContent = "🧠 Loading OpenCV...";
  await waitForCV();
  status.textContent = "✅ Quantum Systems Ready";

  const hands = ["left", "right"];
  const streams = {};

  for (const side of hands) {
    const vid = document.getElementById(`vid${cap(side)}`);
    const canvas = document.getElementById(`canvas${cap(side)}`);
    const ctx = canvas.getContext("2d");

    document.getElementById(`startCam${cap(side)}`).onclick = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        vid.srcObject = stream;
        streams[side] = stream;
        status.textContent = `📷 ${side} camera active`;
      } catch (e) { status.textContent = "⚠️ " + e.message; }
    };

    document.getElementById(`capture${cap(side)}`).onclick = () => {
      if (!streams[side]) return alert("Start camera first!");
      ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);
      vid.pause();
      status.textContent = `📸 ${side} hand captured`;
    };

    document.getElementById(`analyze${cap(side)}`).onclick = async () => {
      status.textContent = `🧬 Quantum analyzing ${side} hand...`;
      await drawQuantumPalm(canvas);
      const report = analyzePalmEnergy(side);
      document.getElementById(`miniReport${cap(side)}`).textContent = report.text;
      speakSinhala(report.voice);
      status.textContent = "✨ Analysis complete!";
    };
  }
}

function speakSinhala(text) {
  if (!window.speechSynthesis) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "si-LK";
  u.pitch = 1.1;
  u.rate = 1;
  speechSynthesis.speak(u);
}

startSystem();
