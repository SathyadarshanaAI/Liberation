// High-res still capture using ImageCapture (fallback to video draw)
async captureHiRes(canvas) {
  const track = this.track;
  if (!track) { this._status('Camera not active'); return false; }

  // Prefer ImageCapture if available (higher than preview res)
  if ('ImageCapture' in window) {
    try {
      const ic = new ImageCapture(track);

      // (Optional) try to hint capabilities – safe no-ops if unsupported
      if (ic.getPhotoCapabilities) {
        try {
          const pc = await ic.getPhotoCapabilities();
          this._log('camera', { step: 'photoCapabilities', pc });
          // Some browsers respect imageWidth/Height in takePhoto options:
          // pick max safely (clamped later by UA)
          const want = {};
          if (pc.imageWidth)  want.imageWidth  = pc.imageWidth.max;
          if (pc.imageHeight) want.imageHeight = pc.imageHeight.max;
          // take the photo with hints if we have any
          const blob = await ic.takePhoto(want);
          await this._drawBlobToCanvas(blob, canvas);
          this._status('Captured (hi-res photo)');
          return true;
        } catch {
          // fall through to plain takePhoto()
        }
      }

      // Plain takePhoto without options
      const blob = await ic.takePhoto();
      await this._drawBlobToCanvas(blob, canvas);
      this._status('Captured (hi-res photo)');
      return true;
    } catch (e) {
      this._log('capture', { step:'ImageCapture failed', err: e?.name || e });
      // fall back
    }
  }

  // Fallback: current video-based contain capture
  return this.captureTo(canvas);
}

// Helper: draw Blob to canvas at native resolution (no crop)
async _drawBlobToCanvas(blob, canvas) {
  // Prefer createImageBitmap (fast), fallback to Image()
  let bmp = null;
  try {
    bmp = await createImageBitmap(blob);
  } catch {
    bmp = await new Promise((res, rej) => {
      const img = new Image();
      img.onload = () => res(img);
      img.onerror = rej;
      img.src = URL.createObjectURL(blob);
    });
  }
  const iw = bmp.width, ih = bmp.height;
  canvas.width = iw;   // native pixels
  canvas.height = ih;

  // show nicely in the box (no crop)
  Object.assign(canvas.style, {
    position:'absolute', inset:0, width:'100%', height:'100%',
    borderRadius:'16px', zIndex:2
  });

  const ctx = canvas.getContext('2d');
  ctx.drawImage(bmp, 0, 0, iw, ih);

  // cleanup object URLs if created
  if (bmp instanceof Image && bmp.src.startsWith('blob:')) {
    try { URL.revokeObjectURL(bmp.src); } catch {}
  }
  this._log('capture', { mode:'hires', iw, ih });
}
