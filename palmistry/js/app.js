 // =====================================================
// app.js — Handles camera and canvas operations
// =====================================================

export async function initApp() {
  const hands = ["left", "right"];
  let streams = {};

  for (const side of hands) {
    const video = document.getElementById(`vid${cap(side)}`);
    const canvas = document.getElementById(`canvas${cap(side)}`);
    const ctx = canvas.getContext("2d");

    // Start camera
    document.getElementById(`startCam${cap(side)}`).onclick = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        video.srcObject = stream;
        streams[side] = stream;
        document.getElementById("status").textContent = `📷 ${side.toUpperCase()} camera running`;
      } catch (err) {
        alert("⚠️ Camera access denied or unavailable: " + err.message);
      }
    };

    // Capture image
    document.getElementById(`capture${cap(side)}`).onclick = () => {
      if (!streams[side]) return alert("Start camera first!");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      video.pause();
      document.getElementById("status").textContent = `📸 ${side} captured`;
    };
  }

  return { left: document.getElementById("canvasLeft"), right: document.getElementById("canvasRight") };
}

function cap(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
