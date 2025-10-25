// --- modules/camera.js ---
// Dual-hand modular camera controller for V9.6 Dual-Hand Intelligence

export class CameraUnit {
  constructor(videoId, canvasId, label) {
    this.video = document.getElementById(videoId);
    this.canvas = document.getElementById(canvasId);
    this.label = label;
    this.stream = null;
  }

  async start() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      this.video.srcObject = stream;
      await this.video.play();
      this.stream = stream;
      return `✅ ${this.label} camera started`;
    } catch (err) {
      console.error(err);
      return `❌ Camera error: ${err.message}`;
    }
  }

  capture() {
    if (!this.video.videoWidth) return `⚠️ Start ${this.label} camera first!`;
    const ctx = this.canvas.getContext("2d");
    this.canvas.width = this.video.videoWidth;
    this.canvas.height = this.video.videoHeight;
    ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
    return `📸 ${this.label} hand captured`;
  }

  async toggleTorch() {
    if (!this.stream) return `⚠️ Start ${this.label} camera first!`;
    const track = this.stream.getVideoTracks()[0];
    const caps = track.getCapabilities();
    if (!caps.torch) return "🔦 Torch not supported";
    const current = track.getSettings().torch || false;
    await track.applyConstraints({ advanced: [{ torch: !current }] });
    return `🔦 Torch ${!current ? "ON" : "OFF"} (${this.label})`;
  }
}
