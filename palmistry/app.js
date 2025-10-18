// modules/camara.js
// Mobile-friendly camera helper for Palm Analyzer (back camera, torch, crop capture)

export class CameraCard {
  /**
   * @param {HTMLElement} container - where to place the <video>
   * @param {{facingMode?: 'environment'|'user', onStatus?: (msg:string)=>void}} opts
   */
  constructor(container, opts = {}) {
    this.container   = container;
    this.onStatus    = opts.onStatus || (()=>{});
    this.facingMode  = opts.facingMode || 'environment';
    this.stream      = null;
    this.video       = document.createElement('video');

    // Mobile autoplay requirements
    this.video.setAttribute('playsinline', '');
    this.video.setAttribute('muted', 'true');
    this.video.muted = true;
    this.video.autoplay = true;
    this.video.style.width  = '100%';
    this.video.style.height = '100%';
    this.video.style.objectFit = 'cover';
    this.video.style.display = 'block';
    this.video.style.background = '#000';

    // mount once
    if (!this.container.querySelector('video')) {
      this.container.appendChild(this.video);
    }

    this.torchOn = false;
    this.track   = null;
  }

  _log(tag, ...args) { try { console.tag?.(tag, ...args) ?? console.log(`[${tag}]`, ...args); } catch {} }
  _status(msg) { try { this.onStatus(msg); } catch {} }

  async _pickBackCamera() {
    try {
      const devs = await navigator.mediaDevices.enumerateDevices();
      const videos = devs.filter(d => d.kind === 'videoinput');
      // prefer "back"/"rear" camera if available
      const back = videos.find(v => /back|rear|environment/i.test(v.label));
      return back?.deviceId || videos[0]?.deviceId || null;
    } catch (e) {
      this._log('camera', 'enumerateDevices failed', e);
      return null;
    }
  }

  async start() {
    // stop previous
    await this.stop();

    if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
      this._status('Camera requires HTTPS (use Netlify/GitHub Pages).');
      this._log('camera', 'blocked: not https');
      throw new Error('getUserMedia requires HTTPS on mobile');
    }

    // Try to get environment camera with constraints
    let constraints = {
      video: {
        facingMode: this.facingMode,       // 'environment' or 'user'
        width:  { ideal: 1280 },
        height: { ideal: 720 },
        frameRate: { ideal: 30 }
      },
      audio: false
    };

    try {
      this._status('Requesting camera…');
      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
    } catch (err1) {
      // fallback by deviceId (some phones ignore facingMode)
      this._log('camera', 'facingMode getUserMedia failed, fallback by deviceId', err1?.name);
      const id = await this._pickBackCamera();
      if (!id) { this._status('No camera found'); throw err1; }
      constraints = { video: { deviceId: { exact: id } }, audio: false };
      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
    }

    this.video.srcObject = this.stream;
    await this.video.play().catch(()=>{});
    // cache track for torch
    this.track = this.stream.getVideoTracks()[0] || null;

    // Resize container video nicely after metadata ready
    await new Promise(res=>{
      const r = ()=>res();
      if (this.video.readyState >= 2) return res();
      this.video.onloadedmetadata = r;
      setTimeout(r, 500);
    });

    this._status('🎥 Camera ready');
    this._log('camera', 'ready', {
      width:  this.video.videoWidth,
      height: this.video.videoHeight,
      label:  this.track?.label
    });
    return true;
  }

  async stop() {
    if (this.stream) {
      this.stream.getTracks().forEach(t => t.stop());
      this.stream = null;
      this.track = null;
      this._log('camera', 'stopped');
    }
  }

  /**
   * Draw a centered crop of the live video onto target canvas (3:4 “portrait” look)
   */
  captureTo(targetCanvas) {
    if (!this.video || !this.video.videoWidth) {
      this._status('Camera not ready for capture.');
      this._log('capture', 'blocked: no video frames');
      return;
    }
    // Target aspect 3:4
    const aspect = 3/4;
    const vw = this.video.videoWidth;
    const vh = this.video.videoHeight;
    let sw = vw, sh = vh;

    // center-crop to match aspect
    if (vw / vh > aspect) { // too wide -> crop width
      sh = vh;
      sw = Math.round(vh * aspect);
    } else { // too tall -> crop height
      sw = vw;
      sh = Math.round(vw / aspect);
    }
    const sx = Math.floor((vw - sw) / 2);
    const sy = Math.floor((vh - sh) / 2);

    targetCanvas.width  = sw;
    targetCanvas.height = sh;

    const ctx = targetCanvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, sw, sh);
    ctx.drawImage(this.video, sx, sy, sw, sh, 0, 0, sw, sh);

    this._log('capture', 'frame drawn', {sw, sh, sx, sy});
  }

  /**
   * Toggle torch if supported (Android Chrome + back camera)
   */
  async toggleTorch() {
    if (!this.track) { this._status('Torch: camera not started'); return; }
    const caps = this.track.getCapabilities?.();
    if (!caps || !('torch' in caps)) {
      this._status('Torch not supported on this device');
      this._log('torch', 'not supported');
      return;
    }
    this.torchOn = !this.torchOn;
    try {
      await this.track.applyConstraints({ advanced: [{ torch: this.torchOn }] });
      this._status(this.torchOn ? '🔦 Torch ON' : '💡 Torch OFF');
      this._log('torch', 'state', this.torchOn);
    } catch (e) {
      this._status('Torch toggle failed');
      this._log('torch', 'applyConstraints failed', e);
    }
  }
}
