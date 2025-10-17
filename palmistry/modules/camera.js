export class CameraCard {
  constructor(host, opts={}) {
    this.host = host;
    this.opts = { facingMode: opts.facingMode || 'environment', onStatus: opts.onStatus || (()=>{}) };
    this.video = document.createElement('video');
    Object.assign(this.video, { playsInline: true, muted: true, autoplay: true });
    this.video.setAttribute('playsinline', '');
    this.video.style.position = 'absolute';
    this.video.style.inset = '0';
    this.video.style.width = '100%';
    this.video.style.height = '100%';
    this.video.style.objectFit = 'cover';
    this.video.style.borderRadius = '16px';
    this.host.prepend(this.video);

    this.stream = null;
    this.track = null;
    this.torchOn = false;
  }

  _status(msg){ this.opts.onStatus(String(msg)); }
  async start(){ /* same as previous code */ }
  async stop(){ /* same as previous code */ }
  async switch(){ /* same as previous code */ }
  async toggleTorch(){ /* same as previous code */ }
  captureTo(targetCanvas){ /* same as previous code */ }
}
