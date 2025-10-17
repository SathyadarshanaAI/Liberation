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
        width: { ideal: 3840, min: 1280 },
        height: { ideal: 5120, min: 1706 }
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
    // Lock to 3:4 aspect ratio, crop center if needed
    const aspect = 3 / 4;
    let vw = this.video.videoWidth, vh = this.video.videoHeight;
    let tw = vw, th = vh;
    if (vw / vh > aspect) {
      tw = vh * aspect; th = vh;
    } else {
      tw = vw; th = vw / aspect;
    }
    targetCanvas.width = tw;
    targetCanvas.height = th;
    const ctx = targetCanvas.getContext('2d');
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, tw, th);
    ctx.drawImage(this.video, (vw - tw) / 2, (vh - th) / 2, tw, th, 0, 0, tw, th);
    this._status('Frame captured');
    return true;
  }
}
