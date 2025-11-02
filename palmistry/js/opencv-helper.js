// 🧠 Sathyadarshana OpenCV Helper — V18.2 Pure Palm Filter Edition
// Purpose: Detect palm lines precisely, remove noisy background edges, and blend with soft glow.

export async function analyzeEdges(canvasId) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext("2d");
  const src = cv.imread(canvas);
  const gray = new cv.Mat();
  const blur = new cv.Mat();
  const edges = new cv.Mat();
  const mask = new cv.Mat();
  const final = new cv.Mat();

  try {
    // 🌓 Convert to grayscale
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);

    // 🌫️ Reduce noise (gentle blur)
    cv.GaussianBlur(gray, blur, new cv.Size(5, 5), 1.5, 1.5, cv.BORDER_DEFAULT);

    // ⚡ Detect palm edges (Canny)
    cv.Canny(blur, edges, 60, 140, 3, false);

    // 🪷 Focus only on palm center area (ROI crop)
    let roi = new cv.Rect(25, 60, src.cols - 50, src.rows - 100);
    let cropped = edges.roi(roi);

    // 🔮 Brighten palm edges slightly for better visibility
    cv.convertScaleAbs(cropped, cropped, 1.3, 25);

    // 🌈 Create a clean binary mask
    cv.threshold(cropped, mask, 40, 255, cv.THRESH_BINARY);

    // ✨ Blend mask with source (keep only hand region)
    cv.bitwise_and(src, src, final, mask);

    // 🧘 Draw to canvas with glow
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    cv.imshow(canvas, final);

    // 🩵 Soft glow overlay
    ctx.globalCompositeOperation = "screen";
    ctx.shadowBlur = 15;
    ctx.shadowColor = "rgba(0,255,255,0.8)";
    ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height);
    ctx.shadowBlur = 0;
    ctx.globalCompositeOperation = "source-over";

    console.log("✅ Pure Palm Filtered Edge Glow Rendered.");
  } catch (err) {
    console.error("⚠️ OpenCV palm detection error:", err);
  } finally {
    src.delete();
    gray.delete();
    blur.delete();
    edges.delete();
    mask.delete();
    final.delete();
  }
}
