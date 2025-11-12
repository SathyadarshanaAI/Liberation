// 🕉️ Sathyadarshana Quantum Palm Analyzer · lines-3d.js
// ✅ TruePalm Natural Glow Mode — retains skin tone under the 3D aura

export async function drawQuantumPalm(canvas) {
  try {
    const src = cv.imread(canvas);
    const gray = new cv.Mat();
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

    // Detect soft edges
    const edges = new cv.Mat();
    cv.Sobel(gray, edges, cv.CV_8U, 1, 1, 3, 1, 0, cv.BORDER_DEFAULT);

    // Create coloured glow from edges
    const color = new cv.Mat();
    cv.applyColorMap(edges, color, cv.COLORMAP_PLASMA); // softer glow palette

    // Create soft blur aura
    const aura = new cv.Mat();
    const glow = new cv.Mat();
    cv.GaussianBlur(color, aura, new cv.Size(21, 21), 7, 7, cv.BORDER_DEFAULT);
    cv.addWeighted(aura, 0.5, color, 1.0, 0, glow);

    // ✅ Blend with original palm (preserve natural tone)
    const final = new cv.Mat();
    cv.addWeighted(src, 0.75, glow, 0.35, 0, final);

    cv.imshow(canvas, final);

    // Memory cleanup
    src.delete(); gray.delete(); edges.delete(); color.delete();
    aura.delete(); glow.delete(); final.delete();

    console.log("✅ TruePalm Natural Glow rendering complete");
  } catch (err) {
    console.error("❌ drawQuantumPalm() failed:", err);
  }
}
