async function initOpenCV() {
  return new Promise(resolve => {
    const check = setInterval(() => {
      if (typeof cv !== "undefined" && cv.Mat) {
        clearInterval(check);
        resolve();
      }
    }, 500);
  });
}

async function main() {
  document.getElementById("status").textContent = "🧠 Loading OpenCV...";
  await initOpenCV();
  document.getElementById("status").textContent = "✅ OpenCV Ready. Initializing camera...";

  const hands = ["left", "right"];
  let streams = {};

  for (const side of hands) {
    const vid = document.getElementById(`vid${cap(side)}`);
    const canvas = document.getElementById(`canvas${cap(side)}`);
    const ctx = canvas.getContext("2d");

    // Start Camera
    document.getElementById(`startCam${cap(side)}`).onclick = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        vid.srcObject = stream;
        streams[side] = stream;
        document.getElementById("status").textContent = `📷 ${side} camera active`;
      } catch (err) {
        document.getElementById("status").textContent = "⚠️ " + err.message;
      }
    };

    // Capture
    document.getElementById(`capture${cap(side)}`).onclick = () => {
      if (!streams[side]) return alert("Start camera first!");
      ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);
      vid.pause();
      document.getElementById("status").textContent = `📸 ${side} hand captured`;
    };

    // Analyze
    document.getElementById(`analyze${cap(side)}`).onclick = () => {
      document.getElementById("status").textContent = `🧠 Analyzing ${side} hand...`;
      analyzePalm(canvas);
      document.getElementById("status").textContent = "✨ 3D Palm Outline Rendered!";
    };
  }
}

function cap(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function analyzePalm(canvas) {
  const src = cv.imread(canvas);
  const gray = new cv.Mat();
  cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
  const dst = new cv.Mat();
  cv.Canny(gray, dst, 50, 150, 3, false);
  cv.imshow(canvas, dst);
  src.delete(); gray.delete(); dst.delete();
}

main();
