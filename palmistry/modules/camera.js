// moduler/camara.js
export class CameraCard {
  constructor(host, opts = {}) {
    this.host = host;
    this.opts = { facingMode: opts.facingMode || 'environment', onStatus: opts.onStatus || (() => {}) };

    this.video = document.createElement('video');
    Object.assign(this.video, { playsInline: true, muted: true, autoplay: true });
    this.video.setAttribute('playsinline', '');
    this.video.style.position   = 'absolute';
    this.video.style.objectFit  = 'contain';
    this.video.style.width      = '100%';
    this.video.style.height     = '100%';
    this.video.style.borderRadius = '16px';
    this.video.style.zIndex = '0'; // canvas on top
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
    try{
      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
    }catch(e){
      this.stream = await navigator.mediaDevices.getUserMedia({ video:true, audio:false }); // fallback
    }
    this.video.srcObject = this.stream;
    this.track = this.stream.getVideoTracks()[0] || null;
    this.video.hidden = false; // show live preview
    this._status('Camera active');
    await this.video.play().catch(()=>{});
    return true;
  }

  async stop(){
    try{ if (this.stream) this.stream.getTracks().forEach(t=>t.stop()); } finally {
      this.stream = null; this.track = null; this.video.srcObject = null;
    }
  }

  async toggleTorch(){
    if (!this.track){ this._status('Torch: camera not active'); return false; }
    const caps = this.track.getCapabilities?.() || {};
    if (!('torch' in caps)){ this._status('Torch not supported on this device/browser'); return false; }
    this.torchOn = !this.torchOn;
    try{
      await this.track.applyConstraints({ advanced: [{ torch: this.torchOn }] });
      this._status(this.torchOn ? 'Torch ON' : 'Torch OFF');
      return this.torchOn;
    }catch(e){ this._status('Torch control failed'); return false; }
  }

  // ✅ FULL-FIT + LOCK: whole frame fit to canvas, then freeze (stop) and hide video
  captureTo(targetCanvas){
    if (!this.video.videoWidth){ this._status('No video frame yet'); return false; }

    // canvas size = current camBox size (no visual change), HiDPI aware
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const bw = this.host.clientWidth  * dpr;
    const bh = this.host.clientHeight * dpr;
    targetCanvas.width  = Math.max(1, Math.round(bw));
    targetCanvas.height = Math.max(1, Math.round(bh));

    const ctx = targetCanvas.getContext('2d');
    ctx.fillStyle = '#ffffff'; // background (letterbox areas)
    ctx.fillRect(0,0,targetCanvas.width,targetCanvas.height);

    // scale-to-fit (contain) without crop → palm FULL photo
    const vw = this.video.videoWidth, vh = this.video.videoHeight;
    const scale = Math.min(targetCanvas.width / vw, targetCanvas.height / vh);
    const dw = Math.round(vw * scale);
    const dh = Math.round(vh * scale);
    const dx = Math.floor((targetCanvas.width  - dw)/2);
    const dy = Math.floor((targetCanvas.height - dh)/2);
    ctx.drawImage(this.video, 0, 0, vw, vh, dx, dy, dw, dh);

    // lock view: stop stream & hide video, so canvas stays on screen
    this.stop();
    this.video.hidden = true;

    this._status('Frame captured (locked)');
    return true;
  }
}
