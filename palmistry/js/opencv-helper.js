// opencv-helper.js — V1.0 Serenity Vision Edge Detector
export function detectPalmLines(canvasId) {
  try {
    if (!window.cv || !cv.imread) {
      console.warn("⚠️ OpenCV not yet loaded or failed to initialize.");
      return;
    }

    const src = cv.imread(canvasId);
    const gray = new cv.Mat();
    const edges = new cv.Mat();

    // grayscale + blur + canny edge detection
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
    cv.GaussianBlur(gray, gray, new cv.Size(3, 3), 0, 0, cv.BORDER_DEFAULT);
    cv.Canny(gray, edges, 60, 120, 3, false);

    // blend edges to overlay color (cyan glow)
    const colorEdges = new cv.Mat();
    cv.cvtColor(edges, colorEdges, cv.COLOR_GRAY2RGBA);
    cv.addWeighted(src, 0.8, colorEdges, 0.6, 0, src);

    cv.imshow(canvasId, src);

    // cleanup
    src.delete();
    gray.delete();
    edges.delete();
    colorEdges.delete();

    console.log("✅ Palm edges visualized successfully.");
  } catch (err) {
    console.error("❌ detectPalmLines() error:", err);
  }
}
