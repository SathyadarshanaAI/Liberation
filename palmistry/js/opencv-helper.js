// opencv-helper.js — Palm Line Edge Detection helper
export function detectPalmLines(canvasId) {
  if (!window.cv || !cv.imread) {
    console.warn("⚠️ OpenCV not loaded yet.");
    return;
  }

  const src = cv.imread(canvasId);
  const dst = new cv.Mat();
  cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
  cv.GaussianBlur(dst, dst, new cv.Size(3, 3), 0);
  cv.Canny(dst, dst, 60, 120, 3, false);
  cv.imshow(canvasId, dst);

  src.delete();
  dst.delete();
  console.log("✅ Palm edge map drawn via OpenCV.");
}
