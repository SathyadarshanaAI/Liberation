// modules/camera.js
// Camera utilities + UI-friendly class wrapper
// Exports:
//   - CameraCard (class)
//   - openCamera(opts) -> MediaStream
//   - stopCamera(stream)
//   - startLoop({ stream, canvasLeft?, canvasRight?, mirrorRight? }) -> () => stop
//   - captureToCanvas(canvas, { sourceStream?, video?, mirror?, cover? })

/* ===========================
 * Helpers
 * =========================== */

function ensureVideoEl() {
  const v = document.createElement('video');
  v.autoplay = true;
  v.muted = true;            // allow autoplay on mobile
  v.playsInline = true;      // iOS inline playback
  v.setAttribute('playsinline', '');
  return v;
}

function videoFromStream(stream) {
  // Find an existing <video> bound to this stream
  const videos = Array.from(document.querySelectorAll('video'));
  return videos.find(v => v.srcObject === stream) || null;
}

function drawCover(ctx, video, canvas, { mirror = false } = {}) {
  const vw = video.videoWidth || 640;
  const vh = video.videoHeight || 480;
  const cw = canvas.width;
  const ch = canvas.height;

  // cover fit
  const vr = vw / vh;
  const cr = cw / ch;
  let sx, sy, sw, sh;
  if (vr > cr) { // wider video
    sh = vh;
    sw = vh * cr;
    sx = (vw - sw) / 2;
    sy = 0;
  } else {       // taller video
    sw = vw;
    sh = vw / cr;
    sx = 0;
    sy = (vh - sh) / 2;
  }

  ctx.save();
  if (mirror) {
    ctx.translate(cw, 0);
    ctx.scale(-1, 1);
  }
  ctx.drawImage(video, sx, sy, sw, sh, 0, 0, cw, ch);
  ctx.restore();
}

/* ===========================
 * Public API
 * =========================== */

export async function openCamera(opts = {}) {
  const {
    facingMode = 'environment',
    width = { ideal: 1920 },
    height = { ideal: 1080 }
  } = opts;

  const constraints = {
    audio: false,
    video: {
      facingMode,
      width,
      height,
      advanced: [{ focusMode: 'continuous' }]
    }
  };
  return navigator.mediaDevices.getUserMedia(constraints);
}

export function stopCamera(stream) {
  if (!stream) return;
  try { stream.getTracks().forEach(t => t.stop()); }
  catch { /* noop */ }
}

export function captureToCanvas(canvas, opts = {}) {
  const { sourceStream = null, video = null, mirror = false, cover = true } = opts;
  const v = video || (sourceStream ? videoFromStream(sourceStream) : document.querySelector('video'));
  if (!v) {
    console.warn('[camera] captureToCanvas: no video element found');
    return;
  }
  if (!v.videoWidth) {
    console.warn('[camera] captureToCanvas: video not ready');
    return;
  }
  // keep existing canvas size if already styled in UI; default to video size
  if (!canvas.width || !canvas.height) {
    canvas.width = v.videoWidth;
    canvas.height = v.videoHeight;
  }
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.imageSmoothingEnabled = true;
  if (cover) drawCover(ctx, v, canvas, { mirror });
  else {
    ctx.save();
    if (mirror) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
    ctx.restore();
  }
}

export function startLoop({
  stream,
  canvasLeft,
  canvasRight,
  mirrorRight = () => true,
  fps = 30
}) {
  const v = videoFromStream(stream);
  if (!v) {
    console.warn('[camera] startLoop: no bound video for stream');
    return () => {};
  }

  let rafId = 0;
  let stopped = false;
  const frameInterval = 1000 / fps;
  let last = 0;

  const tick = (t) => {
    if (stopped) return;
    rafId = requestAnimationFrame(tick);
    if (t - last < frameInterval) return;
    last = t;

    if (canvasLeft) {
      const ctxL = canvasLeft.getContext('2d');
      if (canvasLeft.width === 0 || canvasLeft.height === 0) {
        canvasLeft.width = v.videoWidth; canvasLeft.height = v.videoHeight;
      }
      drawCover(ctxL, v, canvasLeft, { mirror: false });
    }

    if (canvasRight) {
      const ctxR = canvasRight.getContext('2d');
      if (canvasRight.width === 0 || canvasRight.height === 0) {
        canvasRight.width = v.videoWidth; canvasRight.height = v.videoHeight;
      }
      drawCover(ctxR, v, canvasRight, { mirror: !!(typeof mirrorRight === 'function' ? mirrorRight() : mirrorRight) });
    }
  };

  rafId = requestAnimationFrame(tick);

  // pause when tab hidden to save battery
  const onVis = () => {
    if (document.hidden) { if (rafId) cancelAnimationFrame(rafId); }
    else { last = 0; rafId = requestAnimationFrame(tick); }
  };
  document.addEventListener('visibilitychange', onVis);

  return () => {
    stopped = true;
    if (rafId) cancelAnimationFrame(rafId);
    document.removeEventListener('visibilitychange', onVis);
  };
}

/* ===========================
 * CameraCard UI wrapper
 * =========================== */

export class CameraCard {
  constructor(container, opts = {}) {
    this.container = container;
    this.opts = opts;
    this.video = ensureVideoEl();
    this.video.style.width = '100%';
    this.video.style.height = 'auto';
    this.video.style.maxHeight = '70vh';
    container.appendChild(this.video);

    this.stream = null;
    this._onStatus = typeof opts.onStatus === 'function' ? opts.onStatus : () => {};
    this._torchOn = false;
  }

  _status(m) { this._onStatus(m); }

  async start() {
    try {
      if (this.stream) this.stop();
      this.stream = await openCamera({ facingMode: this.opts.facingMode || 'environment' });
      this.video.srcObject = this.stream;
      await this.video.play();
      this._status('✅ Camera open');
      return this.stream;
    } catch (e) {
      this._status('❌ Camera error: ' + e.message);
      console.error(e);
      throw e;
    }
  }

  stop() {
    if (!this.stream) return;
    stopCamera(this.stream);
    this.stream = null;
    this._status('🛑 Camera stopped');
  }

  captureTo(canvas, { mirror = false, cover = true } = {}) {
    captureToCanvas(canvas, { video: this.video, mirror, cover });
  }

  async toggleTorch() {
    if (!this.stream) { this._status('Start camera first'); return; }
    const track = this.stream.getVideoTracks()[0];
    const caps = track.getCapabilities?.() || {};
    if (!('torch' in caps)) {
      this._status('Torch not supported on this device/browser');
      return;
    }
    try {
      this._torchOn = !this._torchOn;
      await track.applyConstraints({ advanced: [{ torch: this._torchOn }] });
      this._status(this._torchOn ? '🔦 Torch ON' : '🔦 Torch OFF');
    } catch (e) {
      this._status('Torch not allowed: ' + e.message);
    }
  }
}
