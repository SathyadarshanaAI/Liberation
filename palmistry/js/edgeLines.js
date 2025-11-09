// 🧠 Quantum Palm Analyzer - Edge Detection Core
// Uses OpenCV to isolate and enhance real palm lines

export async function detectPalmEdges(frame, canvas) {
  // Convert raw image to matrix
  const src = cv.matFromImageData(frame);
  const gray = new cv.Mat();
  const blur = new cv.Mat();
  const edges = new cv.Mat();

  try {
    // Step 1️⃣ – Convert to grayscale
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

    // Step 2️⃣ – Reduce noise (Gaussian blur)
    cv.GaussianBlur(gray, blur, new cv.Size(3, 3), 0);

    // Step 3️⃣ – Edge detection (Canny)
    cv.Canny(blur, edges, 70, 140);

    // Step 4️⃣ – Optional contrast enhancement
    const enhanced = new cv.Mat();
    cv.convertScaleAbs(edges, enhanced, 1.2, 0);

    // Step 5️⃣ – Display on canvas (for visual feedback)
    cv.imshow(canvas, enhanced);

    // Step 6️⃣ – Return enhanced edge matrix
    return enhanced;
  } catch (err) {
    console.error("Edge detection error:", err);
    return null;
  } finally {
    // Memory cleanup
    src.delete();
    gray.delete();
    blur.delete();
    edges.delete();
  }
}
