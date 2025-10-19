// modules/camara.js
// CameraCard (max-res, no-crop/contain preview & capture, torch support)

export class CameraCard {
  /**
   * @param {HTMLElement} host
   * @param {{facingMode?: 'environment'|'user', onStatus?: (msg:string)=>void}} opts
   */
  constructor(host, opts = {}) {
    this.host = host;
    this.opts = {
      facingMode: opts.facingMode || 'environment',
      onStatus:   opts.onStatus   || (()=>{})
    };

    // ---- Live <video> preview (NO-CROP) ----
    this.video = document.createElement('video');
    this.video.setAttribute('playsinline', '');
    Object.assign(this.video, { autoplay: true, muted: true, playsInline: true });
    Object.assign(this.video.style, {
      position: 'absolute', inset: 0, width: '100%', height: '100%',
      objectFit: 'contain',               // 👈 no-crop preview
      background: '#000',
      borderRadius: '16px', zIndex: 1
    });

    // Ensure host can position children
    if (getComputedStyle(this.host).position === 'static') this.host.style.position = 'relative';
    this.host.prepend(this.video);

    this.stream = null;
    this.track  = null;
    this.torch  = false;
  }

  _status(m){ try{ this.opts.onStatus(String(m)); }catch{} }
  _log(tag, obj){ try{ (console.tag?console.tag(tag,obj):console.log(`[${tag}]`,obj)); }catch{} }

  // ---- Start camera with max resolution (fallbacks baked in) ----
  async start() {
    await this.stop();

    // Initial request (permission + hint)
    const base = {
      video: {
        facingMode: { ideal: this.opts.facingMode },
        width:  { ideal: 1920 },
        height: { ideal: 1080 },
        frameRate: { ideal: 30 }
      },
      audio: false
    };

    try {
      this._status('Requesting camera…');
      this.stream = await navigator.mediaDevices.getUserMedia(base);
    } catch (e1) {
      // Very permissive fallback
      this._log('camera', { step:'gUM base fail', err:e1?.name||e1 });
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    }

    this.video.hidden = false;
    this.video.srcObject = this.stream;
    this.track = this.stream.getVideoTracks()[0] || null;

    // Push to MAX caps if available
    try {
      const caps = this.track?.getCapabilities?.() || {};
      const want = {};
      if (caps.width && caps.height) {
        want.width  = caps.width.max;
        want.height = caps.height.max;
      }
      if (caps.frameRate) want.frameRate = Math.min(30, caps.frameRate.max || 30);
      if (Object.keys(want).length) {
        this._log('camera', { step:'applyConstraints → max', want });
        await this.track.applyConstraints(want).catch(async ()=>{
          await this.track.applyConstraints({ advanced: [want] });
        });
      }
    } catch (e2) {
      this._log('camera', { step:'applyConstraints fail', err:e2?.name||e2 });
    }

    await this.video.play().catch(()=>{});
    await new Promise(r=>setTimeout(r, 200)); // allow settings to settle

    const st = this.track?.getSettings?.() || {};
    this._log('camera', { step:'settings', st });
    this._status(`Camera active ${st.width||this.video.videoWidth}×${st.height||this.video.videoHeight}`);
    return true;
  }

  async stop() {
    if (this.stream) {
      this.stream.getTracks().forEach(t=>t.stop());
      this.stream = null; this.track = null;
      this.video.srcObject = null;
    }
  }

  // ---- Torch toggle (Android Chrome + back camera) ----
  async toggleTorch() {
    if (!this.track) { this._status('Torch: camera not active'); return false; }
    const caps = this.track.getCapabilities?.() || {};
    if (!('torch' in caps)) { this._status('Torch not supported on this device/browser'); return false; }
    try {
      this.torch = !this.torch;
      await this.track.applyConstraints({ advanced: [{ torch: this.torch }] });
      this._status(this.torch ? '🔦 Torch ON' : '💡 Torch OFF');
      return this.torch;
    } catch (e) {
      this._status('Torch control failed'); this._log('torch', e?.name||e); return false;
    }
  }

  /**
   * Capture (NO-CROP / CONTAIN):
   * - Keeps the whole sensor frame visible inside the canvas (letterbox/pillarbox if needed).
   * - Canvas pixel size = current box size × DPR (for sharp UI export).
   */
  captureTo(targetCanvas) {
    const vw = this.video.videoWidth, vh = this.video.videoHeight;
    if (!vw || !vh) { this._status('No video frame yet'); return false; }

    // Canvas pixels based on visible box size (high DPI)
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const BW  = Math.max(1, Math.round(this.host.clientWidth  * dpr));
    const BH  = Math.max(1, Math.round(this.host.clientHeight * dpr));
    targetCanvas.width  = BW;
    targetCanvas.height = BH;

    Object.assign(targetCanvas.style, {
      position:'absolute', inset:0, width:'100%', height:'100%', borderRadius:'16px', zIndex:2
    });

    const ctx = targetCanvas.getContext('2d');
    ctx.fillStyle = '#000'; ctx.fillRect(0,0,BW,BH);

    // CONTAIN fit (no crop)
    const s  = Math.min(BW / vw, BH / vh);
    const dw = Math.round(vw * s);
    const dh = Math.round(vh * s);
    const dx = Math.floor((BW - dw) / 2);
    const dy = Math.floor((BH - dh) / 2);
    ctx.drawImage(this.video, 0,0,vw,vh, dx,dy,dw,dh);

    this._status(`Frame captured (no-crop) ${dw}×${dh}`);
    this._log('capture', { BW, BH, vw, vh, dw, dh, dx, dy });
    return true;
  }

  /**
   * OPTIONAL: Native 1:1 full-resolution capture (no crop, no scaling).
   * - Use when you want the raw sensor frame size file for download/AI.
   */
  captureNative(targetCanvas) {
    const vw = this.video.videoWidth, vh = this.video.videoHeight;
    if (!vw || !vh) { this._status('No video frame yet'); return false; }

    targetCanvas.width  = vw;
    targetCanvas.height = vh;

    // Let CSS fit it in the UI without distortion
    Object.assign(targetCanvas.style, {
      position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'contain',
      borderRadius:'16px', zIndex:2
    });

    const ctx = targetCanvas.getContext('2d');
    ctx.drawImage(this.video, 0, 0, vw, vh);

    this._status(`Frame captured native ${vw}×${vh}`);
    this._log('capture-native', { vw, vh });
    return true;
  }

  /**
   * OPTIONAL: Cover-style capture (will crop if aspect mismatches).
   * - Keep if you ever need edge-to-edge fill without letterboxing.
   */
  captureCover(targetCanvas) {
    const vw = this.video.videoWidth, vh = this.video.videoHeight;
    if (!vw || !vh) { this._status('No video frame yet'); return false; }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const BW  = Math.max(1, Math.round(this.host.clientWidth  * dpr));
    const BH  = Math.max(1, Math.round(this.host.clientHeight * dpr));
    targetCanvas.width  = BW;
    targetCanvas.height = BH;

    Object.assign(targetCanvas.style, {
      position:'absolute', inset:0, width:'100%', height:'100%', borderRadius:'16px', zIndex:2
    });

    // COVER fit (crop may happen)
    const s  = Math.max(BW / vw, BH / vh);
    const dw = Math.round(vw * s);
    const dh = Math.round(vh * s);
    const dx = Math.floor((BW - dw) / 2);
    const dy = Math.floor((BH - dh) / 2);

    const ctx = targetCanvas.getContext('2d');
    ctx.drawImage(this.video, 0,0,vw,vh, dx,dy,dw,dh);

    this._status(`Frame captured (cover) ${dw}×${dh}`);
    this._log('capture-cover', { BW, BH, vw, vh, dw, dh, dx, dy });
    return true;
  }
}
