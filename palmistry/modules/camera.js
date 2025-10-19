// modules/camera.js
// Universal CameraCard: Android/iOS/desktop, autoplay overlay,
// max-res applyConstraints, hi-res still capture (ImageCapture),
// and no-crop "contain" capture with padding/offset.

export class CameraCard {
  /**
   * @param {HTMLElement} host
   * @param {{facingMode?: 'environment'|'user', onStatus?: (msg:string)=>void}} opts
   */
  constructor(host, opts = {}) {
    this.host       = host;
    this.onStatus   = opts.onStatus || (()=>{});
    this.facingMode = opts.facingMode || 'environment';

    // Live preview <video> (no-crop)
    this.video = document.createElement('video');
    this.video.setAttribute('playsinline','');
    Object.assign(this.video, { autoplay:true, muted:true, playsInline:true });
    Object.assign(this.video.style, {
      position:'absolute', inset:0, width:'100%', height:'100%',
      objectFit:'contain', objectPosition:'50% 50%',
      background:'#000', borderRadius:'16px', zIndex:1
    });

    if (getComputedStyle(this.host).position === 'static') this.host.style.position = 'relative';
    if (!this.host.style.minHeight) this.host.style.minHeight = '320px';
    this.host.prepend(this.video);

    // Tap-to-start overlay (for autoplay block)
    this.overlay = document.createElement('button');
    this.overlay.textContent = '▶ Tap to Start Camera';
    Object.assign(this.overlay.style, {
      position:'absolute', inset:0, margin:'auto', width:'70%', height:'48px',
      maxWidth:'420px', borderRadius:'10px', border:'1px solid #22d3ee',
      background:'#0b0f16', color:'#e2e8f0', fontSize:'16px', zIndex:2, display:'none'
    });
    this.host.appendChild(this.overlay);
    this.overlay.addEventListener('click', async ()=>{
      try { await this.video.play(); this.overlay.style.display='none'; this._status('🎥 Camera playing'); }
      catch { this._status('Tap again to start'); }
    });

    // State
    this.stream = null;
    this.track  = null;

    // Framing tweaks
    this.pad = 0.92;   // 0.75..1 (lower = zoom-out)
    this.offsetY = 0;  // -0.3..0.3
  }

  // ---------- helpers ----------
  _status(m){ try{ this.onStatus(String(m)); }catch{} }
  _log(tag, obj){ try{ (console.tag?console.tag(tag, obj):console.log(`[${tag}]`, obj)); }catch{} }
  setFramePad(p=0.92){ this.pad = Math.max(0.75, Math.min(1, p)); }
  setOffsetY(v=0){ this.offsetY = Math.max(-0.3, Math.min(0.3, v)); }

  async _pickDeviceId(preferBack=true){
    try{
      const devs = await navigator.mediaDevices.enumerateDevices();
      const cams = devs.filter(d=>d.kind==='videoinput');
      if (!cams.length) return null;
      if (!preferBack) return cams[0].deviceId;
      const back = cams.find(c=>/back|rear|environment/i.test(c.label));
      return (back?.deviceId) || cams[0].deviceId;
    }catch{return null;}
  }

  async _maximizeResolution(){
    try{
      if (!this.track || !this.track.getCapabilities) return;
      const caps = this.track.getCapabilities();
      const want = {};
      if (caps.width && caps.height){
        const MAXW = Math.min(caps.width.max, 4096);
        const MAXH = Math.min(caps.height.max, 4096);
        want.width = MAXW; want.height = MAXH;
      }
      if (caps.frameRate) want.frameRate = Math.min(30, caps.frameRate.max || 30);
      if (Object.keys(want).length){
        this._log('CAMERA', { step:'applyConstraints → max', want });
        await this.track.applyConstraints(want).catch(async()=> {
          await this.track.applyConstraints({ advanced:[want] });
        });
        await new Promise(r=>setTimeout(r,150));
      }
    }catch(e){
      this._log('CAMERA', { step:'applyConstraints fail', err:e?.name||e });
    }
  }

  // ---------- lifecycle ----------
  async start(){
    if (!navigator.mediaDevices?.getUserMedia){
      this._status('Camera API not available. Use Upload Photo.');
      return false;
    }
    await this.stop();
    this._status('Requesting camera…');

    // Try facingMode first
    let constraints = {
      video:{ facingMode:this.facingMode, width:{ideal:1920}, height:{ideal:1080}, frameRate:{ideal:30} },
      audio:false
    };
    try{
      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
    }catch(e1){
      this._log('CAMERA', { step:'facingMode fail', err:e1?.name||e1 });
      try{
        const id = await this._pickDeviceId(true);
        if (id) this.stream = await navigator.mediaDevices.getUserMedia({ video:{ deviceId:{ exact:id } }, audio:false });
        else    this.stream = await navigator.mediaDevices.getUserMedia({ video:true, audio:false });
      }catch(e2){
        this._status('Camera permission denied or not found');
        this._log('CAMERA', { step:'fallback fail', err:e2?.name||e2 });
        return false;
      }
    }

    this.video.hidden = false;
    this.video.srcObject = this.stream;
    this.track = this.stream.getVideoTracks()[0] || null;

    await this._maximizeResolution();

    try{ await this.video.play(); }
    catch{ this.overlay.style.display='block'; }

    await new Promise(r=>setTimeout(r,200));
    const st = this.track?.getSettings?.() || {};
    this._log('CAMERA', { step:'settings', st });
    this._status(`Camera active ${st.width||this.video.videoWidth}×${st.height||this.video.videoHeight}`);
    return true;
  }

  async stop(){
    if (this.stream){
      this.stream.getTracks().forEach(t=>t.stop());
      this.stream = null; this.track = null;
      this.video.srcObject = null;
      this.overlay.style.display = 'none';
    }
  }

  // ---------- capture (video frame, contain, pad/offset) ----------
  captureTo(canvas){
    const vw=this.video.videoWidth, vh=this.video.videoHeight;
    if (!vw || !vh){ this._status('No video frame yet'); return false; }

    const dpr = Math.min(window.devicePixelRatio||1, 2);
    const BW  = Math.max(1, Math.round(this.host.clientWidth  * dpr));
    const BH  = Math.max(1, Math.round(this.host.clientHeight * dpr));
    canvas.width=BW; canvas.height=BH;

    Object.assign(canvas.style, { position:'absolute', inset:0, width:'100%', height:'100%', borderRadius:'16px', zIndex:2 });

    const ctx = canvas.getContext('2d');
    ctx.fillStyle='#000'; ctx.fillRect(0,0,BW,BH);

    const s  = Math.min(BW/vw, BH/vh) * this.pad;
    const dw = Math.round(vw*s);
    const dh = Math.round(vh*s);
    let dx   = Math.floor((BW-dw)/2);
    let dy   = Math.floor((BH-dh)/2 + this.offsetY*BH);
    dx = Math.max(0, Math.min(BW-dw, dx));
    dy = Math.max(0, Math.min(BH-dh, dy));

    ctx.drawImage(this.video, 0,0,vw,vh, dx,dy,dw,dh);

    this._status(`Captured ${dw}×${dh}`);
    this._log('CAPTURE',{BW,BH,vw,vh,dw,dh,dx,dy,pad:this.pad,offsetY:this.offsetY});
    return true;
  }

  // ---------- capture (hi-res still via ImageCapture; fallback to captureTo) ----------
  async captureHiRes(canvas){
    const track = this.track;
    if (!track){ this._status('Camera not active'); return false; }

    if ('ImageCapture' in window){
      try{
        const ic = new ImageCapture(track);

        if (ic.getPhotoCapabilities){
          try{
            const pc = await ic.getPhotoCapabilities();
            this._log('CAMERA', { step:'photoCapabilities', pc });
            const want = {};
            if (pc.imageWidth)  want.imageWidth  = pc.imageWidth.max;
            if (pc.imageHeight) want.imageHeight = pc.imageHeight.max;
            const blob = await ic.takePhoto(want);
            await this._drawBlobToCanvas(blob, canvas);
            this._status('Captured (hi-res photo)');
            return true;
          }catch{/* fall back to plain takePhoto */}
        }

        const blob = await ic.takePhoto();
        await this._drawBlobToCanvas(blob, canvas);
        this._status('Captured (hi-res photo)');
        return true;
      }catch(e){
        this._log('CAPTURE', { step:'ImageCapture failed', err:e?.name||e });
      }
    }

    // Fallback
    return this.captureTo(canvas);
  }

  // Draw Blob/Bitmap to canvas 1:1
  async _drawBlobToCanvas(blob, canvas){
    let bmp=null;
    try{ bmp = await createImageBitmap(blob); }
    catch{
      bmp = await new Promise((res, rej)=>{
        const img = new Image();
        img.onload = ()=>res(img);
        img.onerror = rej;
        img.src = URL.createObjectURL(blob);
      });
    }
    const iw = bmp.width, ih = bmp.height;
    canvas.width = iw; canvas.height = ih;

    Object.assign(canvas.style, {
      position:'absolute', inset:0, width:'100%', height:'100%',
      borderRadius:'16px', zIndex:2
    });

    const ctx = canvas.getContext('2d');
    ctx.drawImage(bmp, 0, 0, iw, ih);

    if (bmp instanceof Image && bmp.src && String(bmp.src).startsWith('blob:')) {
      try{ URL.revokeObjectURL(bmp.src); }catch{}
    }
    this._log('CAPTURE', { mode:'hires', iw, ih });
  }
}
