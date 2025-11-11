// ===============================
// 🧠 main.js – Sathyadarshana V28.0
// ===============================

import { detectPalmEdges } from './edgeLines.js';

// Wait until OpenCV ready
async function waitForOpenCV() {
  return new Promise(resolve => {
    const check = setInterval(() => {
      if (window.cv && cv.Mat) {
        clearInterval(check);
        resolve(true);
      }
    }, 500);
  });
}

// Initialize
async function initPalmAnalyzer() {
  const status = document.getElementById("status");
  status.textContent = "🪷 Initializing Sathyadarshana Quantum Palm Analyzer...";
  await waitForOpenCV();
  status.textContent = "✨ System Ready for Palm Analysis!";

  const hands = ["left", "right"];
  let streams = {};

  for (const side of hands) {
    const capName = s => s.charAt(0).toUpperCase() + s.slice(1);
    const video = document.getElementById(`vid${capName(side)}`);
    const canvas = document.getElementById(`canvas${capName(side)}`);
    const ctx = canvas.getContext("2d");

    // ▶️ Start camera
    document.getElementById(`startCam${capName(side)}`).onclick = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        video.srcObject = stream;
        streams[side] = stream;
        status.textContent = `📷 ${side.toUpperCase()} camera active`;
      } catch (e) {
        alert("Camera Error: " + e.message);
      }
    };

    // 📸 Capture
    document.getElementById(`capture${capName(side)}`).onclick = () => {
      if (!streams[side]) return alert("Start camera first!");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      video.pause();
      status.textContent = `📸 ${side} hand captured`;
    };

    // 🧠 Analyze
    document.getElementById(`analyze${capName(side)}`).onclick = async () => {
      status.textContent = `🧠 Analyzing ${side} hand...`;

      const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
      try {
        await detectPalmEdges(frame, canvas);
      } catch (err) {
        console.error("Edge detection failed:", err);
        return;
      }

      // 🪞 Mini + Deep Reports
      const mini = `Life line: clear\nHeart line: curved\nFate line: visible medium strength`;
      const deep = `Palm lines suggest intelligence with emotional balance.\nStrength of life energy and leadership potential visible around thumb mount.`;

      document.getElementById(`miniReport${capName(side)}`).textContent = mini;
      document.getElementById(`deepReport${capName(side)}`).textContent = deep;

      // 🗣 Sinhala + English Voice
      const msg = side === "left"
        ? "ඔයාගේ වම් අතේ රේඛා ශක්තිමත්යි. ආත්ම ශක්තිය පිරිසිදු බව පෙන්වයි."
        : "ඔයාගේ දකුණු අතේ රේඛා විශ්වාස සහ නායකත්වය පෙන්වයි.";
      const voice = new SpeechSynthesisUtterance(msg);
      voice.lang = "si-LK";
      voice.pitch = 1;
      voice.rate = 1;
      speechSynthesis.speak(voice);

      status.textContent = "✅ Palm Analysis Complete!";
    };
  }
}

initPalmAnalyzer();
