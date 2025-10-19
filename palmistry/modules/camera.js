// modules/camera.js
export class CameraCard {
  constructor(hostEl, { facingMode = 'environment', onStatus = () => {} } = {}) {
    this.host = hostEl;
    this.facingMode = facingMode;
    this.onStatus = onStatus;
    this.stream = null;
    this.video = document.createElement('video');
    this.video.autoplay = true;
    this.video.muted = true;          // autoplay policy
    this.video.playsInline = true;    // iOS Safari
    this.video.setAttribute('playsinline','');
    this.video.style.width = '100%';
    this.video.style.height = 'auto';
    this.host.innerHTML = '';
    this.host.appendChild(this.video);
  }

  async start() {
    // guard: secure origin only
    if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
      throw new Error('Camera requires HTTPS (GitHub Pages is OK).');
    }
    // try exact → user → environment fallbacks
    const tries = [
      { video: { facingMode: { exact: this.facingMode }, width: { ideal: 1920 }, height: { ideal: 1080 } }, audio: false },
      { video: { facingMode: this.facingMode, width: { ideal: 1920 }, height: { ideal: 1080 } }, audio: false },
      { video: true, audio: false }
    ];
    let lastErr;
    for (const c of tries) {
      try {
        this.stream = await navigator.mediaDevices.getUserMedia(c);
        break;
      } catch (e) { lastErr = e; }
    }
    if (!this.stream) {
      this.onStatus('Camera unavailable'); 
      throw lastErr || new Error('No camera');
    }
    this.video.srcObject = this.stream;
    await this.video.play().catch(()=>{});
    this.onStatus('Camera started');
    this._initTrack(); // setup track & imageCapture for torch
  }

  _initTrack() {
    this.track = this.stream.getVideoTracks()[0];
    try {
      this.imageCapture = ('ImageCapture' in window) ? new ImageCapture(this.track) : null;
    } catch { this.imageCapture = null; }
  }

  stop() {
    if (this.stream) {
      this.stream.getTracks().forEach(t => t.stop());
      this.stream = null;
    }
    this.onStatus('Camera stopped');
  }

  captureTo(canvas) {
    if (!this.video.videoWidth) { this.onStatus('No frame yet'); return; }
    // lock 3:4 canvas like your UI
    const w = this.video.videoWidth;
    const h = this.video.videoHeight;
    const aspect = 3/4;
    let tw, th, sx, sy;
    if (w/h > aspect) { th = h; tw = h*aspect; sx = (w-tw)/2; sy = 0; }
    else { tw = w; th = w/aspect; sx = 0; sy = (h-th)/2; }
    canvas.width = tw; canvas.height = th;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#000'; ctx.fillRect(0,0,tw,th);
    ctx.drawImage(this.video, sx, sy, tw, th, 0, 0, tw, th);
    this.onStatus('Captured');
  }

  async toggleTorch() {
    // Only some Android devices support torch over WebRTC
    try {
      const cap = this.track.getCapabilities?.();
      if (!cap || !cap.torch) { this.onStatus('Torch not supported'); return; }
      const settings = this.track.getSettings?.() || {};
      const newVal = !settings.torch;
      await this.track.applyConstraints({ advanced: [{ torch: newVal }] });
      this.onStatus(newVal ? 'Torch ON' : 'Torch OFF');
    } catch {
      this.onStatus('Torch not supported');
    }
  }
}
