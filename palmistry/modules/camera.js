// modules/camara.js
// Ultra-robust mobile camera helper (environment camera, fallbacks, tap-to-start)

export class CameraCard {
  /**
   * @param {HTMLElement} container
   * @param {{facingMode?: 'environment'|'user', onStatus?: (msg:string)=>void}} opts
   */
  constructor(container, opts = {}) {
    this.container  = container;
    this.onStatus   = opts.onStatus || (()=>{});
    this.facingMode = opts.facingMode || 'environment';
    this.stream     = null;
    this.track      = null;
    this.video      = document.createElement('video');

    // style & attrs for mobile autoplay
    this.video.setAttribute('playsinline', '');
    this.video.setAttribute('muted', 'true');
    this.video.muted = true;
    this.video.autoplay = true;
    this.video.style.width = '100%';
    this.video.style.height = '100%';
    this.video.style.objectFit = 'cover';
    this.video.style.display = 'block';
    this.video.style.background = '#000';

    // ensure container is visible (height!)
    this.container.style.position ||= 'relative';
    if (!this.container.style.minHeight) this.container.style.minHeight = '320px';
    if (!this.container.querySelector('video')) this.container.appendChild(this.video);

    // tap-to-start overlay (for autoplay blocks)
    this.overlay = document.createElement('button');
    this.overlay.textContent = '▶ Tap to Start Camera';
    Object.assign(this.overlay.style, {
      position:'absolute', inset:'0', margin:'auto', width:'70%', height:'48px',
      maxWidth:'420px', borderRadius:'10px', border:'1px solid #22d3ee',
      background:'#0b0f16', color:'#e2e8f0', fontSize:'16px', display:'none', zIndex:'5'
    });
    this.container.appendChild(this.overlay);
    this.overlay.addEventListener('click', async () => {
      try { await this.video.play(); this.overlay.style.display = 'none'; this._status('🎥 Camera playing'); }
      catch (e) { this._status('Tap failed, try again'); this._log('camera','tap play failed', e?.name); }
    });

    this.torchOn = false;
  }

  _log(tag, ...args) { try { (console.tag ? console.tag(tag, ...args) : console.log(`[${tag}]`, ...args)); } catch {} }
  _status(msg){ try { this.onStatus(msg); } catch {} }

  async _enumerateVideoId(preferBack=true) {
    try {
      const devs   = await navigator.mediaDevices.enumerateDevices();
      const videos = devs.filter(d => d.kind === 'videoinput');
      if (videos.length === 0) return null;
      if (!preferBack) return videos[0].deviceId;
      const back = videos.find(v => /back|rear|environment/i.test(v.label));
      return (back?.deviceId) || videos[0].deviceId;
    } catch (e) {
      this._log('camera','enumerateDevices error', e?.name || e);
      return null;
    }
  }

  async _tryGet(constraints, label) {
    try {
      this._log('camera','getUserMedia try', label, constraints);
      const s = await navigator.mediaDevices.getUserMedia(constraints);
      this._log('camera','getUserMedia OK', label);
      return s;
    } catch (e) {
      this._log('camera','getUserMedia FAIL', label, e?.name || e);
      throw e;
    }
  }

  async start() {
    // stop previous
    await this.stop();

    if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
      this._status('Camera requires HTTPS (use Netlify/GitHub Pages).');
      this._log('camera','blocked: not https');
      throw new Error('HTTPS required');
    }

    this._status('Requesting camera…');

    // 1) facingMode=environment
    let stream = null;
    try {
      stream = await this._tryGet({
        video: {
          facingMode: this.facingMode, width:{ideal:1280}, height:{ideal:720}, frameRate:{ideal:30}
        },
        audio:false
      }, 'facingMode');
    } catch (e1) {
      // 2) fallback by deviceId (prefer back)
      try {
        const id = await this._enumerateVideoId(true);
        if (!id) throw e1;
        stream = await this._tryGet({ video:{ deviceId:{ exact:id } }, audio:false }, 'deviceId(back)');
      } catch (e2) {
        // 3) last resort: any camera
        stream = await this._tryGet({ video:true, audio:false }, 'video:any');
      }
    }

    this.stream = stream;
    this.video.srcObject = stream;
    this.track = stream.getVideoTracks()[0] || null;

    // Wait until metadata/size is ready, then attempt play
    await new Promise(res => {
      let done = false;
      const finish = ()=>{ if (!done){ done=true; res(); } };
      const t = setTimeout(finish, 1500);
      this.video.onloadedmetadata = ()=>{ clearTimeout(t); finish(); };
    });

    try {
      await this.video.play();
      this.overlay.style.display = 'none';
    } catch (e) {
      // Autoplay blocked → show overlay
      this.overlay.style.display = 'block';
      this._log('camera','video.play blocked', e?.name || e);
    }

    // If still no frames, wait a bit longer
    await new Promise(r => setTimeout(r, 300));
    const hasFrame = this.video.videoWidth > 0 && this.video.videoHeight > 0;

    if (!hasFrame) {
      this._status('Camera attached, waiting for frames…');
      // One more wait round
      await new Promise(r => setTimeout(r, 800));
    }

    this._status('🎥 Camera ready');
    this._log('camera','ready', {
      width:  this.video.videoWidth,
      height: this.video.videoHeight,
      label:  this.track?.label || 'n/a'
    });

    // If page returns to foreground, try to keep playing
    document.addEventListener('visibilitychange', async ()=>{
      if (document.visibilityState === 'visible' && this.video.paused) {
        try { await this.video.play(); this.overlay.style.display='none'; } catch {}
      }
    }, { passive:true });

    return true;
  }

  async stop() {
    if (this.stream) {
      this.stream.getTracks().forEach(t => t.stop());
      this.stream = null;
      this.track  = null;
      this._log('camera','stopped');
    }
  }

  captureTo(targetCanvas) {
    if (!this.video || !this.video.videoWidth) {
      this._status('Camera not ready for capture.');
      this._log('capture','blocked: no frame');
      return;
    }
    const aspect = 3/4;
    const vw = this.video.videoWidth, vh = this.video.videoHeight;
    let sw = vw, sh = vh;
    if (vw / vh > aspect) { sh = vh; sw = Math.round(vh * aspect); }
    else { sw = vw; sh = Math.round(vw / aspect); }
    const sx = Math.floor((vw - sw)/2), sy = Math.floor((vh - sh)/2);

    targetCanvas.width = sw; targetCanvas.height = sh;
    const ctx = targetCanvas.getContext('2d');
    ctx.fillStyle = '#fff'; ctx.fillRect(0,0,sw,sh);
    ctx.drawImage(this.video, sx, sy, sw, sh, 0, 0, sw, sh);

    this._log('capture','frame', { sw, sh, sx, sy });
  }

  async toggleTorch() {
    if (!this.track) { this._status('Torch: camera not started'); return; }
    const caps = this.track.getCapabilities?.();
    if (!caps || !('torch' in caps)) {
      this._status('Torch not supported on this device');
      this._log('torch','unsupported');
      return;
    }
    try {
      this.torchOn = !this.torchOn;
      await this.track.applyConstraints({ advanced: [{ torch: this.torchOn }] });
      this._status(this.torchOn ? '🔦 Torch ON' : '💡 Torch OFF');
      this._log('torch','state', this.torchOn);
    } catch (e) {
      this._status('Torch toggle failed');
      this._log('torch','applyConstraints fail', e?.name || e);
    }
  }
}
