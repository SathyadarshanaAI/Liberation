// moduler/camara.js
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
    this.video.style.zIndex = '0'; // canvas stays above
    this.host.prepend(this.video);

    this.stream = null;
    this.track  = null;
    this.torchOn = false;
  }

  _status(m){ this.opts.onStatus(String(m)); }

  async start(){
    await this.stop();
    const constraints = {
      video: { facingMode: { ideal: this.opts.facingMode }, width: { ideal: 1280 }, height: { ideal: 1706 } },
      audio: false
    };
    try {
      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
    } catch {
      // fallback if device refuses strict constraints
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    }
    this.video.srcObject = this.stream;
    this.track = this.stream.getVideoTracks()[0] || null;
    this.video.hidden = false; // show live view
    this._status('Camera active');
    await this.video.play().catch(()=>{});
    return true;
  }

  async stop(){
    try { if (this.stream) this.stream.getTracks().forEach(t=>t.stop()); }
    finally {
      this.stream = null; this.track = null; this.video.srcObject = null;
    }
  }

  async toggleTorch(){
    if (!this.track){ this._status('Torch: camera not active'); return false; }
    const caps = this.track.getCapabilities?.() || {};
    if (!('torch' in caps)){ this._status('Torch not supported on this device/browser'); return false; }
    this.torchOn = !this.torchOn;
    try {
      await this.track.applyConstraints({ advanced: [{ torch: this.torchOn }] });
      this._status(this.torchOn ? 'Torch ON' : 'Torch OFF');
      return this.torchOn;
    } catch {
      this._status('Torch control failed'); return false;
    }
  }

  // FULL-FIT + LOCK: draw full frame (contain) into canvas, then freeze preview
  captureTo(targetCanvas){
    if (!this.video.videoWidth){ this._status('No video frame yet'); return false; }

    // canvas size = camBox size (HiDPI)
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = Math.max(1, Math.round(this.host.clientWidth  * dpr));
    const H = Math.max(1, Math.round(this.host.clientHeight * dpr));
    targetCanvas.width = W; targetCanvas.height = H;

    const ctx = targetCanvas.getContext('2d');
    ctx.fillStyle = '#000'; // keep your theme (black letterbox)
    ctx.fillRect(0,0,W,H);

    const vw = this.video.videoWidth, vh = this.video.videoHeight;
    const s = Math.min(W/vw, H/vh);        // CONTAIN → full photo visible
    const dw = Math.round(vw*s), dh = Math.round(vh*s);
    const dx = Math.floor((W - dw)/2), dy = Math.floor((H - dh)/2);
    ctx.drawImage(this.video, 0,0,vw,vh, dx,dy,dw,dh);

    // lock: stop stream & hide video so canvas stays on screen
    this.stop();
    this.video.hidden = true;

    this._status('Frame captured (locked)');
    return true;
  }
}
