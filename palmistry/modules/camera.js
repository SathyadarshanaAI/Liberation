// cam.js (ES module)
export class CameraCard {
  /**
   * @param {HTMLElement} hostCard  The .camBox element (container)
   * @param {{facingMode?: 'environment'|'user', onStatus?: (msg:string)=>void}} opts
   */
  constructor(hostCard, opts={}){
    this.host = hostCard;
    this.opts = { facingMode: opts.facingMode || 'environment', onStatus: opts.onStatus || (()=>{}) };
    this.video = document.createElement('video');
    Object.assign(this.video, { playsInline: true, muted: true, autoplay: true });
    this.video.setAttribute('playsinline', ''); // iOS Safari
    this.video.style.position = 'absolute';
    this.video.style.inset = '0';
    this.video.style.width = '100%';
    this.video.style.height = '100%';
    this.video.style.objectFit = 'cover';
    this.video.style.borderRadius = '16px';

    this.host.prepend(this.video); // under canvas/aura
    this.stream = null;
    this.track = null;
    this.torchOn = false;
  }

  _status(msg){ this.opts.onStatus(String(msg)); }

  /** Start camera with current facingMode. Requires user gesture in many browsers. */
  async start(){
    await this.stop();
    const constraints = {
      video: {
        facingMode: { ideal: this.opts.facingMode },
        width: { ideal: 1280 }, height: { ideal: 720 },
        advanced: [{ focusMode: 'continuous' }]
      }, audio: false
    };
    try {
      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.video.srcObject = this.stream;
      this.track = this.stream.getVideoTracks()[0] || null;
      this._status('Camera active');
      await this.video.play().catch(()=>{});
      return true;
    } catch (e){
      this._status('Camera access failed. Check site permissions & HTTPS.');
      console.error('[CameraCard] start error', e);
      return false;
    }
  }

  /** Stop camera and release hardware */
  async stop(){
    try {
      if (this.stream){ this.stream.getTracks().forEach(t=>t.stop()); }
    } finally {
      this.stream = null; this.track = null; this.video.srcObject = null;
    }
  }

  /** Switch between front/back cameras */
  async switch(){
    this.opts.facingMode = this.opts.facingMode === 'environment' ? 'user' : 'environment';
    return this.start();
  }

  /** Toggle torch if supported (Android Chrome w/ rear camera). */
  async toggleTorch(){
    if (!this.track) { this._status('Torch: camera not active'); return false; }
    const caps = this.track.getCapabilities?.() || {};
    if (!('torch' in caps)) { this._status('Torch not supported on this device'); return false; }
    this.torchOn = !this.torchOn;
    try {
      await this.track.applyConstraints({ advanced: [{ torch: this.torchOn }] });
      this._status(this.torchOn ? 'Torch ON' : 'Torch OFF');
      return this.torchOn;
    } catch(e){
      this._status('Torch control failed');
      console.error('[CameraCard] torch error', e);
      return false;
    }
  }

  /** Capture current video frame into a target canvas (HiDPI-aware). */
  captureTo(targetCanvas){
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
