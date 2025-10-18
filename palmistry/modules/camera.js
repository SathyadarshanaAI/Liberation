// moduler/camara.js
export class CameraCard {
  constructor(host, opts = {}) {
    this.host = host;
    this.opts = { facingMode: opts.facingMode || "environment", onStatus: opts.onStatus || (()=>{}) };

    // create a <video> inside box (we keep UI look the same)
    this.video = document.createElement("video");
    Object.assign(this.video, { autoplay: true, playsInline: true, muted: true });
    this.video.setAttribute("playsinline", "");
    // place behind canvas
    Object.assign(this.video.style, {
      position: "absolute", inset: 0, width: "100%", height: "100%",
      objectFit: "cover", borderRadius: "16px", zIndex: 1
    });
    // ensure camBox can position children
    if (getComputedStyle(this.host).position === "static") this.host.style.position = "relative";
    this.host.prepend(this.video);

    this.stream = null;
    this.track  = null;
    this.torch  = false;
  }

  _status(msg){ this.opts.onStatus(String(msg)); }

  async start() {
    // stop any old stream
    this.stop();
    const primary = {
      video: { facingMode: { ideal: this.opts.facingMode }, width: { ideal: 1280 }, height: { ideal: 1706 } },
      audio: false
    };
    try {
      this.stream = await navigator.mediaDevices.getUserMedia(primary);
    } catch {
      // device sometimes refuses strict constraints -> fallback
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    }
    this.video.hidden = false;
    this.video.srcObject = this.stream;
    this.track = this.stream.getVideoTracks()[0] || null;
    await this.video.play().catch(()=>{});
    this._status("Camera active");
    return true;
  }

  stop() {
    if (this.stream) {
      this.stream.getTracks().forEach(t=>t.stop());
      this.stream = null; this.track = null;
    }
    this.video.srcObject = null;
  }

  async toggleTorch() {
    try {
      if (!this.track) { this._status("Torch: camera not active"); return false; }
      const caps = this.track.getCapabilities?.() || {};
      if (!caps.torch) { this._status("Torch not supported on this device/browser"); return false; }
      this.torch = !this.torch;
      await this.track.applyConstraints({ advanced: [{ torch: this.torch }] });
      this._status(this.torch ? "Torch ON" : "Torch OFF");
      return this.torch;
    } catch (e) {
      this._status("Torch control failed"); return false;
    }
  }

  // Draw FULL photo into canvas (cover) and lock (freeze)
  captureTo(targetCanvas) {
    if (!this.video.videoWidth) { this._status("No video frame yet"); return false; }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = Math.max(1, Math.round(this.host.clientWidth  * dpr));
    const H = Math.max(1, Math.round(this.host.clientHeight * dpr));
    targetCanvas.width = W; targetCanvas.height = H;

    // keep canvas visually filling the box
    Object.assign(targetCanvas.style, {
      position: "absolute", inset: 0, width: "100%", height: "100%",
      borderRadius: "16px", zIndex: 2
    });

    const ctx = targetCanvas.getContext("2d");
    ctx.fillStyle = "#000"; ctx.fillRect(0,0,W,H);

    // COVER (zoom to fill, center crop a little if needed)
    const vw = this.video.videoWidth, vh = this.video.videoHeight;
    const s  = Math.max(W/vw, H/vh);
    const dw = Math.round(vw*s), dh = Math.round(vh*s);
    const dx = Math.floor((W-dw)/2), dy = Math.floor((H-dh)/2);
    ctx.drawImage(this.video, 0,0,vw,vh, dx,dy,dw,dh);

    // freeze preview
    this.stop();
    this.video.hidden = true;
    // remove any background “play” poster if theme had one
    this.host.style.backgroundImage = "none";

    this._status("Frame captured (locked)");
    return true;
  }
}
