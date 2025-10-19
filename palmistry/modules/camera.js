// modules/camara.js
// Universal CameraCard: Android/iOS/desktop support, autoplay-safe overlay, fallbacks.

export class CameraCard {
  /**
   * @param {HTMLElement} host
   * @param {{facingMode?: 'environment'|'user', onStatus?: (msg:string)=>void}} opts
   */
  constructor(host, opts = {}) {
    this.host  = host;
    this.onStatus = opts.onStatus || (()=>{});
    this.facingMode = opts.facingMode || 'environment';

    // preview <video>
    this.video = document.createElement('video');
    this.video.setAttribute('playsinline',''); // iOS
    Object.assign(this.video, { autoplay:true, muted:true, playsInline:true });
    Object.assign(this.video.style, {
      position:'absolute', inset:0, width:'100%', height:'100%',
      objectFit:'contain', background:'#000', borderRadius:'16px', zIndex:1
    });

    if (getComputedStyle(this.host).position === 'static') this.host.style.position = 'relative';
    this.host.prepend(this.video);

    // tap-to-start overlay (for autoplay blocks in iOS/Android)
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

    this.stream = null;
    this.track  = null;

    // capture tuning (no-crop + little safe margin)
    this.pad = 0.92;      // 0.75..1 (lower = zoom-out)
    this.offsetY = 0;     // -0.3..0.3 (up/down shift)
  }

  _status(m){ try{ this.onStatus(String(m)); }catch{} }
  _log(tag, obj){ try{ (console.tag?console.tag(tag,obj):console.log(`[${tag}]`,obj)); }catch{} }

  setFramePad(p = 0.92){ this.pad = Math.max(0.75, Math.min(1, p)); }
  setOffsetY(v = 0){ this.offsetY = Math.max(-0.3, Math.min(0.3, v)); }

  async start() {
    // feature detect
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      this._status('Camera API not available. Use Upload Photo.');
      return false;
    }

    await this.stop();
    this._status('Requesting camera…');

    // 1) try facingMode (works many browsers)
    let constraints = { video:{ facingMode:this.facingMode, width:{ideal:1280}, height:{ideal:720} }, audio:false };
    try {
      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
    } catch (e1) {
      this._log('camera',{step:'facingMode fail', err:e1?.name||e1});
      // 2) fallback: pick any camera (desktop/iOS)
      try {
        const id = await this._pickDeviceId(true);
        if (id) this.stream = await navigator.mediaDevices.getUserMedia({ video:{ deviceId:{ exact:id } }, audio:false });
        else    this.stream = await navigator.mediaDevices.getUserMedia({ video:true, audio:false });
      } catch (e2) {
        this._status('Camera permission denied or not found'); 
        this._log('camera',{step:'fallback fail', err:e2?.name||e2});
        return false;
      }
    }

    this.video.hidden = false;
    this.video.srcObject = this.stream;
    this.track = this.stream.getVideoTracks()[0] || null;

    // play (may get blocked → overlay)
    try { await this.video.play(); }
    catch { this.overlay.style.display='block'; }

    // small wait for metadata
    await new Promise(r=>setTimeout(r,200));
    const st = this.track?.getSettings?.() || {};
    this._log('camera',{step:'settings', st});
    this._status(`Camera active ${st.width||this.video.videoWidth}×${st.height||this.video.videoHeight}`);
    return true;
  }

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

  async stop(){
    if (this.stream){
      this.stream.getTracks().forEach(t=>t.stop());
      this.stream=null; this.track=null;
      this.video.srcObject=null;
      this.overlay.style.display='none';
    }
  }

  // CONTAIN capture (no-crop), with small zoom-out pad & optional vertical offset
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
    this._log('capture',{BW,BH,vw,vh,dw,dh,dx,dy,pad:this.pad,offsetY:this.offsetY});
    return true;
  }
}
