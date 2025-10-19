// modules/camara.js
// CameraCard — start() එකෙන් stream ගත්තම track capabilities බලලා width/height = max apply කරයි.
// captureTo() එකෙන් VIDEO හි native max frame size එකටම capture කරයි.

export class CameraCard {
  constructor(host, opts = {}) {
    this.host = host;
    this.opts = {
      facingMode: opts.facingMode || "environment",
      onStatus: opts.onStatus || (() => {})
    };

    // live preview <video>
    this.video = document.createElement("video");
    Object.assign(this.video, { autoplay: true, playsInline: true, muted: true });
    this.video.setAttribute("playsinline", "");
    Object.assign(this.video.style, {
      position: "absolute", inset: 0, width: "100%", height: "100%",
      objectFit: "cover", borderRadius: "16px", zIndex: 1, background: "#000"
    });

    if (getComputedStyle(this.host).position === "static") this.host.style.position = "relative";
    this.host.prepend(this.video);

    this.stream = null;
    this.track  = null;
    this.torch  = false;
  }

  _status(msg){ try{ this.opts.onStatus(String(msg)); }catch{} }
  _log(...a){ try{ (console.tag ? console.tag('camera', ...a) : console.log('[camera]', ...a)); }catch{} }

  async start() {
    // stop old
    this.stop();

    // initial request (get permission + any camera)
    const baseConstraints = {
      video: {
        facingMode: { ideal: this.opts.facingMode },
        // give a hint, but we will push to max after stream
        width:  { ideal: 1920 },
        height: { ideal: 1080 }
      },
      audio: false
    };

    try {
      this._status("Requesting camera…");
      this.stream = await navigator.mediaDevices.getUserMedia(baseConstraints);
    } catch (e1) {
      // fallback: very permissive
      this._log('getUserMedia fail (base)', e1?.name || e1);
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    }

    this.video.hidden = false;
    this.video.srcObject = this.stream;
    this.track = this.stream.getVideoTracks()[0] || null;

    // Try to push track to its MAX resolution
    try {
      const caps = this.track?.getCapabilities?.() || {};
      const desired = {};
      if (caps.width && caps.height) {
        desired.width  = caps.width.max;
        desired.height = caps.height.max;
      }
      // keep frameRate sane for mobile heat/battery
      if (caps.frameRate) desired.frameRate = Math.min(30, caps.frameRate.max || 30);

      if (Object.keys(desired).length) {
        this._log('applyConstraints → max', desired);
        // First try simple
        await this.track.applyConstraints(desired).catch(async () => {
          // Some browsers prefer advanced[]
          await this.track.applyConstraints({ advanced: [desired] });
        });
      }
    } catch (e2) {
      this._log('applyConstraints(max) failed', e2?.name || e2);
      // continue with current settings
    }

    // play video
    await this.video.play().catch(()=>{});
    // Wait a moment to ensure settings updated
    await new Promise(r => setTimeout(r, 200));

    const st = this.track?.getSettings?.() || {};
    this._log('settings', st);
    this._status(`Camera active ${st.width || this.video.videoWidth}×${st.height || this.video.videoHeight}`);

    return true;
  }

  stop() {
    if (this.stream) {
      this.stream.getTracks().forEach(t => t.stop());
      this.stream = null; this.track = null;
    }
    this.video.srcObject = null;
  }

  async toggleTorch() {
    try {
      if (!this.track) { this._status("Torch: camera not active"); return false; }
      const caps = this.track.getCapabilities?.() || {};
      if (!('torch' in caps)) { this._status("Torch not supported on this device/browser"); return false; }
      this.torch = !this.torch;
      await this.track.applyConstraints({ advanced: [{ torch: this.torch }] });
      this._status(this.torch ? "🔦 Torch ON" : "💡 Torch OFF");
      return this.torch;
    } catch (e) {
      this._status("Torch control failed");
      this._log('torch fail', e?.name || e);
      return false;
    }
  }

  // Capture at NATIVE (max) resolution of the current video frame
  captureTo(targetCanvas) {
    const vw = this.video.videoWidth;
    const vh = this.video.videoHeight;
    if (!vw || !vh) { this._status("No video frame yet"); return false; }

    // Prefer track settings (after max-constraints) if available
    const st = this.track?.getSettings?.() || {};
    const W = st.width  || vw;
    const H = st.height || vh;

    // Canvas pixels = native frame size (max)
    targetCanvas.width  = W;
    targetCanvas.height = H;

    // Canvas CSS still fit the box nicely
    Object.assign(targetCanvas.style, {
      position: "absolute", inset: 0, width: "100%", height: "100%",
      borderRadius: "16px", zIndex: 2
    });

    const ctx = targetCanvas.getContext("2d");
    // Draw the raw frame 1:1 (no crop/scale)
    ctx.drawImage(this.video, 0, 0, W, H);

    // Freeze preview for UX (optional)
    this.stop();
    this.video.hidden = true;
    this.host.style.backgroundImage = "none";

    this._status(`Frame captured (${W}×${H})`);
    this._log('capture', { W, H });
    return true;
  }
}
