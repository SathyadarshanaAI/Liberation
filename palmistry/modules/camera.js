export class CameraCard {
  constructor(host, opts = {}) {
    this.host = host;
    this.opts = { facingMode: opts.facingMode || 'environment', onStatus: opts.onStatus || (() => {}) };
    this.video = document.createElement('video');
    Object.assign(this.video, { playsInline: true, muted: true, autoplay: true });
    this.video.setAttribute('playsinline', '');
    this.video.style.position = 'absolute';
    this.video.style.objectFit = 'contain';
    this.video.style.width = '100%';
    this.video.style.height = '100%';
    this.video.style.borderRadius = '16px';
    this.host.prepend(this.video);
    this.stream = null;
    this.track = null;
    this.torchOn = false;
  }

  _status(msg) {
    this.opts.onStatus(String(msg));
  }

  async start() {
    await this.stop();
    const constraints = {
      video: {
        facingMode: { ideal: this.opts.facingMode },
        width: { ideal: 3840, min: 1280 }, // 4K ideal, fallback to HD
        height: { ideal: 2160, min: 720 }
      },
      audio: false
    };
    try {
      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.video.srcObject = this.stream;
      this.track = this.stream.getVideoTracks()[0] || null;
      this._status('Camera active');
      await this.video.play();
      return true;
    } catch (e) {
      this._status('Camera access failed. Check permissions & HTTPS.');
      return false;
    }
  }

  async stop() {
    if (this.stream) {
      this.stream.getTracks().forEach(t => t.stop());
    }
    this.stream = null;
    this.track = null;
    this.video.srcObject = null;
  }

  async toggleTorch() {
    if (!this.track) {
      this._status('Torch: camera not active');
      return false;
    }
    const caps = this.track.getCapabilities?.() || {};
    if (!('torch' in caps) || !caps.torch) {
      this._status('Torch not supported on this device/browser');
      return false;
    }
    this.torchOn = !this.torchOn;
    try {
      await this.track.applyConstraints({ advanced: [{ torch: this.torchOn }] });
      this._status(this.torchOn ? 'Torch ON' : 'Torch OFF');
      return this.torchOn;
    } catch (e) {
      this._status('Torch control failed');
      return false;
    }
  }

  captureTo(targetCanvas) {
    if (!this.video.videoWidth) {
      this._status('No video frame yet');
      return false;
    }
    const vw = this.video.videoWidth;
    const vh = this.video.videoHeight;
    targetCanvas.width = vw;
    targetCanvas.height = vh;
    const ctx = targetCanvas.getContext('2d');
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, vw, vh);
    ctx.drawImage(this.video, 0, 0, vw, vh);
    this._status('Frame captured');
    return true;
  }
}
