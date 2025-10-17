// Camera module (ESM)
export class CameraCard {
  constructor(host, opts={}) {
    this.host = host;
    this.opts = { facingMode: opts.facingMode || 'environment', onStatus: opts.onStatus || (()=>{}) };
    this.video = document.createElement('video');
    Object.assign(this.video, { playsInline: true, muted: true, autoplay: true });
    this.video.setAttribute('playsinline', '');
    this.video.style.position = 'absolute';
    this.video.style.inset = '0';
    this.video.style.width = '100%';
    this.video.style.height = '100%';
    this.video.style.objectFit = 'cover';
    this.video.style.borderRadius = '16px';
    this.host.prepend(this.video);

    this.stream = null;
    this.track = null;
    this.torchOn = false;
  }

  _status(msg){ this.opts.onStatus(String(msg)); }
  async start(){
    await this.stop();
    const constraints = {
      video: { facingMode: { ideal: this.opts.facingMode }, width: { ideal: 1280 }, height: { ideal: 720 } },
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
      console.error('[CameraCard] start error', e);
      return false;
    }
  }
  async stop() {
    if (this.stream) { this.stream.getTracks().forEach(t => t.stop()); }
    this.stream = null; this.track = null; this.video.srcObject = null;
  }
  async switch() {
    this.opts.facingMode = this.opts.facingMode === 'environment' ? 'user' : 'environment';
    return this.start();
  }
  async toggleTorch() {
    if (!this.track) { this._status('Torch: camera not active'); return false; }
    const caps = this.track.getCapabilities?.() || {};
    if (!('torch' in caps)) { this._status('Torch not supported'); return false; }
    this.torchOn = !this.torchOn;
    try {
      await this.track.applyConstraints({ advanced: [{ torch: this.torchOn }] });
      this._status(this.torchOn ? 'Torch ON' : 'Torch OFF');
      return this.torchOn;
    } catch(e){
      this._status('Torch control failed');
      return false;
    }
  }
  captureTo(targetCanvas) {
    if (!this.video.videoWidth) { this._status('No video frame yet'); return false; }
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    targetCanvas.width = this.host.clientWidth * dpr;
    targetCanvas.height = this.host.clientHeight * dpr;
    const g = targetCanvas.getContext('2d');
    g.drawImage(this.video, 0, 0, targetCanvas.width, targetCanvas.height);
    this._status('Frame captured');
    return true;
  }
}
