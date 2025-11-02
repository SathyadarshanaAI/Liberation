// 🧠 Sathyadarshana OpenCV Helper · V18.1 Divine Edge Glow Edition
// Purpose: Smooth palm edge detection + glow blending layer

export async function analyzeEdges(canvasId) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext("2d");
  const src = cv.imread(canvas);
  const dst = new cv.Mat();

  try {
    // Convert to grayscale
    cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY, 0);

    // Gaussian blur to smooth noise
    cv.GaussianBlur(dst, dst, new cv.Size(3, 3), 0, 0, cv.BORDER_DEFAULT);

    // Detect edges (Canny method)
    cv.Canny(dst, dst, 45, 125, 3, false);

    // Convert back to color
    cv.cvtColor(dst, dst, cv.COLOR_GRAY2RGBA, 0);

    // ✨ Clear canvas before blending
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 🌈 Glow blending effect
    ctx.globalAlpha = 0.9;
    ctx.globalCompositeOperation = "screen";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "rgba(0,255,255,0.8)";
    ctx.drawImage(cv.imshow(canvas, dst), 0, 0, canvas.width, canvas.height);

    // Reset shadow
    ctx.shadowBlur = 0;
    ctx.shadowColor = "transparent";
    ctx.globalAlpha = 1.0;
    ctx.globalCompositeOperation = "source-over";

    console.log("✅ Palm edges visualized successfully.");
  } catch (err) {
    console.error("⚠️ OpenCV edge detection error:", err);
  } finally {
    src.delete();
    dst.delete();
  }
}
