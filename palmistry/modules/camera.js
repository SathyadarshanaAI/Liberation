captureTo(targetCanvas) {
  const vw = this.video.videoWidth;
  const vh = this.video.videoHeight;
  if (!vw || !vh) { this._status("No video frame yet"); return false; }

  // 1) Canvas size = box size in CSS pixels * DPR (sharp output) — NO forced aspect
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const BW = Math.max(1, Math.round(this.host.clientWidth  * dpr));
  const BH = Math.max(1, Math.round(this.host.clientHeight * dpr));
  targetCanvas.width  = BW;
  targetCanvas.height = BH;

  // 2) Keep canvas filling UI, no crop
  Object.assign(targetCanvas.style, {
    position: "absolute", inset: 0, width: "100%", height: "100%",
    borderRadius: "16px", zIndex: 2
  });

  const ctx = targetCanvas.getContext("2d");
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, BW, BH);

  // 3) CONTAIN: scale to fit whole video inside the box (letterbox as needed)
  const s  = Math.min(BW / vw, BH / vh);      // 👈 contain (was Math.max = cover)
  const dw = Math.round(vw * s);
  const dh = Math.round(vh * s);
  const dx = Math.floor((BW - dw) / 2);
  const dy = Math.floor((BH - dh) / 2);

  ctx.drawImage(this.video, 0, 0, vw, vh, dx, dy, dw, dh);

  this._status(`Frame captured (no-crop) ${dw}×${dh}`);
  // (Retain stream so user can re-capture)
  // this.stop(); this.video.hidden = true;  // ❌ remove freeze if you want live preview
  return true;
}
