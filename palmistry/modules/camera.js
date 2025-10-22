// modules/camera.js — Quantum Palm Analyzer V5.7
export class CameraCard {
  constructor(container, opts = {}) {
    this.container = container;
    this.opts = opts;
    this.video = document.createElement('video');
    this.video.autoplay = true;
    this.video.playsInline = true;
    this.video.style.width = "100%";
    this.video.style.height = "100%";
    this.video.style.objectFit = "cover";
    this.container.appendChild(this.video);
    this.stream = null;
    this.track = null;
    this.torchOn = false;
  }

  async start() {
    try {
      if (this.stream) {
        this.stop();
      }
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: this.opts.facingMode || 'environment' },
        audio: false
      });
      this.video.srcObject = this.stream;
      this.track = this.stream.getVideoTracks()[0];
      this.opts.onStatus?.("📸 Camera active");
    } catch (err) {
      console.error(err);
      this.opts.onStatus?.("❌ Camera access denied", false);
    }
  }

  stop() {
    if (this.stream) {
      this.stream.getTracks().forEach(t => t.stop());
      this.stream = null;
      this.opts.onStatus?.("⛔ Camera stopped");
    }
  }

  captureTo(canvas, { mirror = false, cover = false } = {}) {
    if (!this.video.videoWidth) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width = this.video.videoWidth;
    const h = canvas.height = this.video.videoHeight;
    if (mirror) {
      ctx.translate(w, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(this.video, 0, 0, w, h);
    if (mirror) ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.opts.onStatus?.("📸 Palm captured");
  }

  toggleTorch() {
    if (!this.track) {
      this.opts.onStatus?.("⚠️ Torch unavailable", false);
      return;
    }
    const capabilities = this.track.getCapabilities();
    if (!capabilities.torch) {
      this.opts.onStatus?.("⚠️ Torch not supported", false);
      return;
    }
    this.torchOn = !this.torchOn;
    this.track.applyConstraints({ advanced: [{ torch: this.torchOn }] });
    this.opts.onStatus?.(this.torchOn ? "🔦 Torch ON" : "💡 Torch OFF");
  }
}
