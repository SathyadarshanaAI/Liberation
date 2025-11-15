// render/palm-3d-render.js
// Minimal 2D-to-3D visualiser placeholder: draws lines on a floating canvas overlay

export function renderPalm3D(lines) {
  // Create or reuse overlay canvas
  let cvs = document.getElementById("palm3dCanvas");
  if (!cvs) {
    cvs = document.createElement("canvas");
    cvs.id = "palm3dCanvas";
    cvs.style.position = "fixed";
    cvs.style.right = "12px";
    cvs.style.bottom = "12px";
    cvs.style.width = "220px";
    cvs.style.height = "320px";
    cvs.style.borderRadius = "8px";
    cvs.style.boxShadow = "0 6px 20px rgba(0,0,0,0.7)";
    cvs.style.zIndex = 9999;
    document.body.appendChild(cvs);
  }

  // size in device pixels
  const rectW = 220, rectH = 320;
  cvs.width = rectW * devicePixelRatio;
  cvs.height = rectH * devicePixelRatio;
  cvs.style.width = rectW + "px";
  cvs.style.height = rectH + "px";

  const ctx = cvs.getContext("2d");
  ctx.scale(devicePixelRatio, devicePixelRatio);
  ctx.clearRect(0,0,rectW,rectH);

  // background
  ctx.fillStyle = "#001010";
  ctx.fillRect(0,0,rectW,rectH);

  // draw simplified lines
  ctx.strokeStyle = "#00eaff";
  ctx.lineWidth = 2;
  lines.slice(0,8).forEach((l, idx) => {
    ctx.beginPath();
    // map points to small canvas
    const s = (p) => [ (p[0] / (l.points[0][0] || 1)) * (rectW*0.6) + 20, (p[1] % rectH) / (l.points[0][1] || rectH) * (rectH*0.9) + 10 ];
    // fallback simple path: use relative positions across canvas
    const first = l.points[0];
    ctx.moveTo(20 + idx*6, 40 + idx*10);
    ctx.lineTo(rectW - 20 - idx*6, rectH - 40 - idx*10);
    ctx.stroke();
  });

  // a small title
  ctx.fillStyle = "#00eaff";
  ctx.font = "12px Arial";
  ctx.fillText("Palm 3D (preview)", 10, 14);
}
