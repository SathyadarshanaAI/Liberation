// modules/camera.js
export class CameraCard {
  constructor(host, opts = {}) {
    this.host = host;
    this.opts = { facingMode: opts.facingMode || 'environment', onStatus: opts.onStatus || (() => {}) };

    // keep original background so we can hide/show poster without changing external CSS
    const cs = getComputedStyle(this.host);
    this._posterBG = {
      image: cs.backgroundImage,
      color: cs.backgroundColor,
    };
    this._posterHidden = false;

    this.video = document.createElement('video');
    Object.assign(this.video, { playsInline: true, muted: true, autoplay: true });
    this.video.setAttribute('playsinline', '');
    this.video.style.position   = 'absolute';
    this.video.style.objectFit  = 'contain';
    this.video.style.width      = '100%';
    this.video.style.height     = '100%';
    this.video.style.borderRadius = '16px';
    this.video.style.zIndex = '0'; // canvas stays visually on top
    this.host.prepend(this.video);

    this.stream = null;
    this.track  = null;
    this.torchOn = false;
  }

  _status(msg){ this.opts.onStatus(String(msg)); }

  _hidePoster(){
    if (this._posterHidden) return;
    // hide only the poster—keep rest of styling as-is; no external CSS required
    this.host.style.backgroundImage = 'none';
    // keep color but make it transparent so captured image is clean
    this.host.style.backgroundColor = 'transparent';
    this._posterHidden = true;
  }
  _showPoster(){
    if (!this._posterHidden) return;
    this.host.style.backgroundImage = this._posterBG.image;
    this.host.style.backgroundColor = this._posterBG.color;
    this._posterHidden = false;
  }

  async start(){
    await this.stop();
    // primary constraints (portrait-ish). If device refuses, we fall back to {video:true}
    const constraints = {
      video: {
        facingMode: { ideal: this.opts.facingMode },
        width:  { ideal: 1280, min: 640 },
        height: { ideal: 1706, min: 800 } // ~3:4 portrait target; flexible
      },
      audio: false
    };
    try {
      const s = await navigator.mediaDevices.getUserMedia(constraints);
      this.stream = s;
      this.video.srcObject = s;
      this.track = s.getVideoTracks()[0] || null;
      this._showPoster(); // live preview shows play/poster again (until capture)
      this._status('Camera active');
      await this.video.play().catch(()=>{});
      return true;
    } catch (e) {
      // fallback – some devices fail on strict facing/size
      try {
        const s2 = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        this.stream = s2;
        this.video.srcObject = s2;
        this.track = s2.getVideoTracks()[0] || null;
        this._showPoster();
        this._status('Camera active (fallback)');
        await this.video.play().catch(()=>{});
        return true;
      } catch (e2) {
        this._status('Camera access failed. Check permissions & HTTPS.');
        console.warn('[CameraCard] getUserMedia failed:', e, e2);
        return false;
      }
    }
  }

  async stop(){
    try{
      if (this.stream) this.stream.getTracks().forEach(t => t.stop());
    } finally {
      this.stream = null;
      this.track  = null;
      this.video.srcObject = null;
    }
  }

  async toggleTorch(){
    if (!this.track){
      this._status('Torch: camera not active');
      return false;
    }
    const caps = this.track.getCapabilities?.() || {};
    if (!('torch' in caps)){
      this._status('Torch not supported on this device/browser');
      return false;
    }
    this.torchOn = !this.torchOn;
    try{
      await this.track.applyConstraints({ advanced: [{ torch: this.torchOn }] });
      this._status(this.torchOn ? 'Torch ON' : 'Torch OFF');
      return this.torchOn;
    }catch(e){
      this._status('Torch control failed');
      return false;
    }
  }

  /**
   * Capture current frame into target canvas (3:4), then hide poster and stop stream to "freeze".
   */
  captureTo(targetCanvas){
    if (!this.video.videoWidth){
      this._status('No video frame yet');
      return false;
    }

    // Lock to 3:4; crop center if needed
    const aspect = 3/4;
    let vw = this.video.videoWidth, vh = this.video.videoHeight;
    let tw = vw, th = vh;
    if (vw / vh > aspect) { tw = vh * aspect; th = vh; }
    else { tw = vw; th = vw / aspect; }

    // draw at device pixel ratio for sharper still
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    targetCanvas.width  = Math.round(tw * dpr);
    targetCanvas.height = Math.round(th * dpr);

    const ctx = targetCanvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, targetCanvas.width, targetCanvas.height);
    ctx.drawImage(
      this.video,
      Math.round((vw - tw)/2), Math.round((vh - th)/2), Math.round(tw), Math.round(th),
      0, 0, targetCanvas.width, targetCanvas.height
    );

    // hide poster and freeze by stopping stream
    this._hidePoster();
    this.stop();
    this._status('Frame captured (locked)');
    return true;
  }
}
