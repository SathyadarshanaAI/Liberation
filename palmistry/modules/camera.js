// Simple camera helper with capture and torch toggle
// Usage: const cam = new CameraCard(containerEl, { facingMode:'environment', onStatus:fn })

export class CameraCard {
  constructor(container, opts={}) {
    this.container = container;
    this.opts = opts;
    this.stream = null;
    this.video = document.createElement('video');
    this.video.playsInline = true;
    this.video.autoplay = true;
    this.video.muted = true;
    this.video.style.width = '100%';
    this.video.style.height = 'auto';
    this.video.style.maxHeight = '70vh';
    this.container.appendChild(this.video);
    this._onStatus = typeof opts.onStatus === 'function' ? opts.onStatus : ()=>{};
    this._torchOn = false;
  }

  _status(msg){ this._onStatus(msg); }

  async start() {
    // Stop old
    this.stop();
    const constraints = {
      audio: false,
      video: {
        facingMode: this.opts.facingMode || 'environment',
        width: { ideal: 1920 }, height: { ideal: 1080 },
        advanced: [{ focusMode: 'continuous' }]
      }
    };
    try {
      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.video.srcObject = this.stream;
      await this.video.play();
      this._status('✅ Camera open');
    } catch (e) {
      this._status('❌ Camera error: ' + e.message);
      console.error(e);
    }
  }

  stop(){
    if (!this.stream) return;
    for (const t of this.stream.getTracks()) t.stop();
    this.stream = null;
  }

  captureTo(canvas){
    if (!this.video.videoWidth) { this._status('Video not ready'); return; }
    // 3:4 canvas sizing kept by the page; draw fitted
    const vw = this.video.videoWidth, vh = this.video.videoHeight;
    const aspect = 3/4; // width/height
    let tw = vw, th = vh;
    if (vw/vh > aspect) { tw = vh * aspect; th = vh; } else { tw = vw; th = vw/aspect; }
    canvas.width = tw; canvas.height = th;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(this.video, (vw-tw)/2, (vh-th)/2, tw, th, 0, 0, tw, th);
  }

  async toggleTorch(){
    if (!this.stream) { this._status('Start camera first'); return; }
    const track = this.stream.getVideoTracks()[0];
    const cap = track.getCapabilities ? track.getCapabilities() : {};
    if (cap.torch) {
      this._torchOn = !this._torchOn;
      try {
        await track.applyConstraints({ advanced: [{ torch: this._torchOn }] });
        this._status(this._torchOn ? '🔦 Torch ON' : '🔦 Torch OFF');
      } catch (e) {
        this._status('Torch not allowed: ' + e.message);
      }
    } else {
      this._status('Torch not supported on this device/browser');
    }
  }
}
