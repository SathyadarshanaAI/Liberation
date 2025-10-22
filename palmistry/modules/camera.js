// modules/camera.js — Quantum Palm Analyzer V5.8 (Full Capture + Live Preview)
export class CameraCard {
  constructor(container, opts = {}) {
    this.container = container;
    this.opts = opts;

    this.video = document.createElement('video');
    this.video.autoplay = true;
    this.video.playsInline = true;
    this.video.muted = true;
    this.video.style.width = "100%";
    this.video.style.height = "100%";
    this.video.style.objectFit = "cover";
    this.video.style.borderRadius = "14px";
    this.video.style.transition = "opacity 0.25s";
    container.style.position = "relative";
    container.appendChild(this.video);

    this.stream = null;
    this.track = null;
    this.torchOn = false;
  }

  // ==== START CAMERA ====
  async start() {
    try {
      if (this.stream) this.stop();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: this.opts.facingMode || 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      this.stream = stream;
      this.video.srcObject = stream;
      await this.video.play();
      this.track = stream.getVideoTracks()[0];
      this.opts.onStatus?.("📷 Camera active");
    } catch (err) {
      console.error("Camera error:", err);
      this.opts.onStatus?.("❌ Camera access denied", false);
    }
  }

  // ==== STOP CAMERA ====
  stop() {
    if (this.stream) {
      this.stream.getTracks().forEach(t => t.stop());
      this.stream = null;
      this.opts.onStatus?.("⛔ Camera stopped");
    }
  }

  // ==== CAPTURE TO CANVAS (hand image visible) ====
  captureTo(canvas, { mirror = false } = {}) {
    const video = this.video;
    if (!video.videoWidth || !video.videoHeight) {
      this.opts.onStatus?.("⚠️ No camera feed", false);
      return;
    }

    const w = (canvas.width = video.videoWidth);
    const h = (canvas.height = video.videoHeight);
    const ctx = canvas.getContext("2d");

    ctx.save();
    if (mirror) {
      ctx.translate(w, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, w, h);
    ctx.restore();

    // visible flash overlay
    const flash = document.createElement("div");
    flash.style.position = "absolute";
    flash.style.inset = "0";
    flash.style.background = "rgba(255,255,255,0.2)";
    flash.style.borderRadius = "14px";
    flash.style.pointerEvents = "none";
    this.container.appendChild(flash);
    setTimeout(() => flash.remove(), 200);

    // blue scan beam
    const beam = document.createElement("div");
    beam.style.position = "absolute";
    beam.style.left = 0;
    beam.style.top = 0;
    beam.style.width = "100%";
    beam.style.height = "4px";
    beam.style.background = "linear-gradient(90deg, transparent, #00e5ff, transparent)";
    beam.style.animation = "beamScan 1.2s linear";
    beam.style.pointerEvents = "none";
    this.container.appendChild(beam);
    beam.addEventListener("animationend", () => beam.remove());

    if (!document.getElementById("beamAnim")) {
      const style = document.createElement("style");
      style.id = "beamAnim";
      style.textContent = `
        @keyframes beamScan {
          0% { top: 0; opacity: 0.6; }
          50% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    this.opts.onStatus?.("📸 Hand captured to canvas");
  }

  // ==== TORCH ====
  toggleTorch() {
    if (!this.track) {
      this.opts.onStatus?.("⚠️ Torch unavailable", false);
      return;
    }
    const caps = this.track.getCapabilities();
    if (!caps.torch) {
      this.opts.onStatus?.("⚠️ Torch not supported", false);
      return;
    }
    this.torchOn = !this.torchOn;
    this.track.applyConstraints({ advanced: [{ torch: this.torchOn }] });
    this.opts.onStatus?.(this.torchOn ? "🔦 Torch ON" : "💡 Torch OFF");
  }
}
