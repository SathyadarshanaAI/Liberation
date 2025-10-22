// modules/camera.js — Sathyadarshana Quantum Palm Analyzer V6.0 Final
export class CameraCard {
  constructor(container, opts = {}) {
    this.container = container;
    this.opts = opts;
    this.video = document.createElement("video");
    this.video.autoplay = true;
    this.video.playsInline = true;
    this.video.muted = true;
    this.video.style.width = "260px";
    this.video.style.height = "320px";
    this.video.style.borderRadius = "10px";
    container.innerHTML = "";
    container.appendChild(this.video);

    this.stream = null;
    this.track = null;
    this.torchEnabled = false;
  }

  async start() {
    try {
      const constraints = {
        video: {
          facingMode: this.opts.facingMode || "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };
      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.video.srcObject = this.stream;
      await this.video.play();

      const [track] = this.stream.getVideoTracks();
      this.track = track;

      this.opts.onStatus?.("📷 Camera started successfully", true);
      console.log("Camera stream:", track.getSettings());
    } catch (e) {
      console.error("Camera error:", e);
      this.opts.onStatus?.("❌ Camera unavailable or permission denied", false);
    }
  }

  captureTo(canvas, { mirror = false } = {}) {
    if (!this.video.videoWidth) {
      this.opts.onStatus?.("⚠️ Camera not ready", false);
      return;
    }
    const ctx = canvas.getContext("2d");
    canvas.width = this.video.videoWidth;
    canvas.height = this.video.videoHeight;
    ctx.save();
    if (mirror) {
      ctx.scale(-1, 1);
      ctx.drawImage(this.video, -canvas.width, 0, canvas.width, canvas.height);
    } else {
      ctx.drawImage(this.video, 0, 0, canvas.width, canvas.height);
    }
    ctx.restore();
    this.opts.onStatus?.("📸 Image captured", true);
  }

  async toggleTorch() {
    if (!this.track) {
      this.opts.onStatus?.("⚠️ No camera stream to control torch", false);
      return;
    }

    try {
      const capabilities = this.track.getCapabilities();
      if (!capabilities.torch) {
        this.opts.onStatus?.("💡 Torch not supported on this device", false);
        return;
      }

      this.torchEnabled = !this.torchEnabled;
      await this.track.applyConstraints({ advanced: [{ torch: this.torchEnabled }] });
      this.opts.onStatus?.(this.torchEnabled ? "💡 Torch ON" : "🌑 Torch OFF", true);
    } catch (err) {
      console.error("Torch error:", err);
      this.opts.onStatus?.("⚠️ Torch control failed", false);
    }
  }

  stop() {
    if (this.stream) {
      this.stream.getTracks().forEach(t => t.stop());
      this.video.srcObject = null;
      this.opts.onStatus?.("🛑 Camera stopped", true);
    }
  }
}
