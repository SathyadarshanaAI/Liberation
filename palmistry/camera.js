// palmistry/camera.js
console.log("📷 Palmistry Camera Module Loaded");

class PalmCam {
  constructor(videoId, canvasId, boxId, storageKey) {
    this.video = document.getElementById(videoId);
    this.canvas = document.getElementById(canvasId);
    this.boxId = boxId;
    this.key = storageKey;
  }

  async start() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: {ideal:1280}, height:{ideal:720} }
      });
      this.video.srcObject = stream;
      this.stream = stream;
      this.startBeam();
    } catch (e) {
      alert("Camera error: " + e.message);
    }
  }

  capture() {
    const ctx = this.canvas.getContext("2d");
    ctx.save();
    ctx.scale(1, 1); // avoid mirror distortion
    ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
    ctx.restore();
    localStorage.setItem(this.key, this.canvas.toDataURL("image/png"));
    this.stopBeam();
  }

  startBeam() {
    document.querySelector(`#${this.boxId} .scanBeam`).style.display = "block";
  }

  stopBeam() {
    document.querySelector(`#${this.boxId} .scanBeam`).style.display = "none";
  }
}

// ==== initialize both cameras ====
const left = new PalmCam("vidLeft", "canvasLeft", "leftBox", "palmLeft");
const right = new PalmCam("vidRight", "canvasRight", "rightBox", "palmRight");

left.start();
right.start();

document.getElementById("captureLeft").onclick = () => left.capture();
document.getElementById("captureRight").onclick = () => right.capture();
