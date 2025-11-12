// 🕉️ Sathyadarshana Quantum Palm Analyzer · lines-3d.js
// ✅ Named export for drawQuantumPalm()

export async function drawQuantumPalm(canvas) {
  try {
    // Read the canvas image
    const src = cv.imread(canvas);
    const gray = new cv.Mat();
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

    // Detect edges using Sobel filter
    const edges = new cv.Mat();
    cv.Sobel(gray, edges, cv.CV_8U, 1, 1, 3, 1, 0, cv.BORDER_DEFAULT);

    // Apply color map for glow effect
    const color = new cv.Mat();
    cv.applyColorMap(edges, color, cv.COLORMAP_TURBO);

    // Add smooth glow (Gaussian Blur)
    const aura = new cv.Mat();
    const glow = new cv.Mat();
    cv.GaussianBlur(color, aura, new cv.Size(15, 15), 5, 5, cv.BORDER_DEFAULT);
    cv.addWeighted(aura, 0.6, color, 1.2, 0, glow);

    // Show result
    cv.imshow(canvas, glow);

    // Clean memory
    src.delete();
    gray.delete();
    edges.delete();
    color.delete();
    aura.delete();
    glow.delete();

    console.log("✅ drawQuantumPalm() executed successfully");
  } catch (err) {
    console.error("❌ drawQuantumPalm() failed:", err);
  }
}
