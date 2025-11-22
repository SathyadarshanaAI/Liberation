/* ---------- HAND MASK / AI BOX ENHANCEMENTS ---------- */
/* Requires: overlayCanvas, palmCanvas, video, MediaPipe results (landmarks) */
/* Also expects <img id="handMaskLeft"> and <img id="handMaskRight"> preloaded in DOM */

let maskLeftImg = null;
let maskRightImg = null;

function preloadHandMasks() {
  const l = document.getElementById("handMaskLeft");
  const r = document.getElementById("handMaskRight");
  if (l) maskLeftImg = l;
  if (r) maskRightImg = r;
}

/* convex hull helper (Monotone chain) */
function convexHull(points) {
  // points: [[x,y],...]
  if (points.length <= 1) return points.slice();
  points = points.slice().sort((a,b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o,a,b) => (a[0]-o[0])*(b[1]-o[1]) - (a[1]-o[1])*(b[0]-o[0]);
  const lower = [];
  for (let p of points) {
    while (lower.length >= 2 && cross(lower[lower.length-2], lower[lower.length-1], p) <= 0) lower.pop();
    lower.push(p);
  }
  const upper = [];
  for (let i = points.length-1; i >= 0; i--) {
    const p = points[i];
    while (upper.length >= 2 && cross(upper[upper.length-2], upper[upper.length-1], p) <= 0) upper.pop();
    upper.push(p);
  }
  upper.pop(); lower.pop();
  return lower.concat(upper);
}

/* Draw a smooth polygon from hull points (optionally close) */
function drawPolygon(ctx, pts, fill=true, stroke=true, style="#ffd700", alpha=0.18) {
  if (!pts || pts.length === 0) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  if (fill) {
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i=1; i<pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.closePath();
    ctx.fillStyle = style;
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  if (stroke) {
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i=1; i<pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.closePath();
    ctx.strokeStyle = style;
    ctx.lineWidth = 3;
    ctx.stroke();
  }
  ctx.restore();
}

/* Try to draw PNG hand mask, otherwise draw polygon hull mask */
function drawHandMask(landmarks, handedness = "Left") {
  // landmarks: array of 21 {x,y,z} normalized to overlayCanvas size already (pixels)
  if (!overlayCtx) return;

  // build pixel points
  const pts = landmarks.map(p => [p.x, p.y]);

  // use convex hull to get a single outer polygon
  const hull = convexHull(pts);

  // attempt PNG mask that we can scale to bounding box
  if ((handedness && handedness.toLowerCase().includes('left')) && maskLeftImg && maskLeftImg.complete) {
    drawMaskPNGOverHull(maskLeftImg, hull);
    return;
  }
  if ((handedness && handedness.toLowerCase().includes('right')) && maskRightImg && maskRightImg.complete) {
    drawMaskPNGOverHull(maskRightImg, hull);
    return;
  }

  // fallback: draw polygon hull semi-transparent
  drawPolygon(overlayCtx, hull, true, true, "rgba(0,200,255,0.95)", 0.18);
}

/* Draw PNG mask scaled to hull bounding box, using destination-in for mask effect */
function drawMaskPNGOverHull(img, hullPoints) {
  if (!img || hullPoints.length===0) return;

  // get bounding box of hull
  const xs = hullPoints.map(p=>p[0]);
  const ys = hullPoints.map(p=>p[1]);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const w = maxX - minX;
  const h = maxY - minY;

  // small pad to make mask nicer
  const pad = 0.12;
  const dx = Math.max(10, Math.round(w*pad));
  const dy = Math.max(10, Math.round(h*pad));

  const targetX = Math.max(0, minX - dx);
  const targetY = Math.max(0, minY - dy);
  const targetW = Math.min(overlayCanvas.width, w + dx*2);
  const targetH = Math.min(overlayCanvas.height, h + dy*2);

  // Step 1: clear and draw PNG onto overlayCanvas's temporary layer
  // We'll use globalCompositeOperation to mask (destination-in)
  overlayCtx.save();
  overlayCtx.clearRect(0,0, overlayCanvas.width, overlayCanvas.height);

  // draw the PNG (centered to bounding box)
  overlayCtx.drawImage(img, targetX, targetY, targetW, targetH);

  // create a mask from hull -> use destination-in to keep only PNG inside hull
  overlayCtx.globalCompositeOperation = 'destination-in';
  overlayCtx.beginPath();
  overlayCtx.moveTo(hullPoints[0][0], hullPoints[0][1]);
  for (let i=1;i<hullPoints.length;i++) overlayCtx.lineTo(hullPoints[i][0], hullPoints[i][1]);
  overlayCtx.closePath();
  overlayCtx.fillStyle = 'rgba(0,0,0,1)';
  overlayCtx.fill();

  // draw border
  overlayCtx.globalCompositeOperation = 'source-over';
  overlayCtx.strokeStyle = "#ffd700";
  overlayCtx.lineWidth = 3;
  overlayCtx.beginPath();
  overlayCtx.moveTo(hullPoints[0][0], hullPoints[0][1]);
  for (let i=1;i<hullPoints.length;i++) overlayCtx.lineTo(hullPoints[i][0], hullPoints[i][1]);
  overlayCtx.closePath();
  overlayCtx.stroke();

  overlayCtx.restore();
}

/* ---------- integrate into your existing onAIResults ---------- */
/* Replace the part where you compute minX,minY.. and strokeRect with this snippet */
function onAIResults_withMask(results) {
  // assume syncOverlaySize() already called and overlayCtx ready
  overlayCtx.clearRect(0,0, overlayCanvas.width, overlayCanvas.height);

  if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
    lastAIBox = null;
    return;
  }

  const pts = results.multiHandLandmarks[0]; // normalized 0..1 coords

  // convert to pixel-space
  const px = pts.map(p => ({ x: p.x * overlayCanvas.width, y: p.y * overlayCanvas.height }));

  const xs = px.map(p => p.x);
  const ys = px.map(p => p.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);

  lastAIBox = { minX, minY, width: maxX-minX, height: maxY-minY, rawLandmarks: px };

  // draw bounding box lightly (optional)
  overlayCtx.strokeStyle = "rgba(255,215,0,0.9)";
  overlayCtx.lineWidth = 2;
  overlayCtx.strokeRect(minX, minY, maxX-minX, maxY-minY);

  // draw hand-mask (hull/polygon or PNG)
  // if you have a handedness label (from MediaPipe), pass it (e.g. 'Left' or 'Right')
  // otherwise default to left or based on user selection
  const handednessLabel = (results.multiHandedness && results.multiHandedness[0] && results.multiHandedness[0].label) || document.getElementById("handPref").value || "Left";

  // call drawHandMask with pixel landmarks and handedness
  drawHandMask(px, handednessLabel);

  // log
  const dbg = document.getElementById("debugConsole");
  if (dbg) dbg.textContent += "✔ AI box + hand-mask updated\n";
}

/* ---------- call preload early (when DOM ready) ---------- */
window.addEventListener("DOMContentLoaded", () => {
  preloadHandMasks();
});
