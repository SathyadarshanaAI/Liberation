// 🕉️ Sathyadarshana Quantum Palm Analyzer – V29.2 Serenity Edition
// Focused palm-only detection with calm white-gray background

export async function detectPalmEdges(frame, canvas) {
  const ctx = canvas.getContext("2d");
  const mat = cv.matFromImageData(frame);

  // Step 1️⃣ – Convert to grayscale and blur noise
  const gray = new cv.Mat();
  cv.cvtColor(mat, gray, cv.COLOR_RGBA2GRAY, 0);
  cv.GaussianBlur(gray, gray, new cv.Size(3, 3), 0);

  // Step 2️⃣ – Adaptive threshold (keeps only palm intensity)
  const mask = new cv.Mat();
  cv.adaptiveThreshold(gray, mask, 255, cv.ADAPTIVE_THRESH_MEAN_C, cv.THRESH_BINARY_INV, 25, 10);

  // Step 3️⃣ – Canny edge detection (clean lines only)
  const edges = new cv.Mat();
  cv.Canny(gray, edges, 70, 160);

  // Step 4️⃣ – Combine only hand region (suppress background)
  const cleanEdges = new cv.Mat();
  cv.bitwise_and(edges, mask, cleanEdges);

  // Step 5️⃣ – Soft white-gray calm base
  ctx.fillStyle = "#e9ebef"; // 🩶 light serene tone
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Step 6️⃣ – Draw edges in gentle blue
  const colorEdges = new cv.Mat();
  cv.cvtColor(cleanEdges, colorEdges, cv.COLOR_GRAY2BGR, 0);
  const blue = new cv.Scalar(0, 120, 255, 255);
  const contours = new cv.MatVector();
  const hierarchy = new cv.Mat();
  cv.findContours(cleanEdges, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
  for (let i = 0; i < contours.size(); ++i) {
    cv.drawContours(colorEdges, contours, i, blue, 1, cv.LINE_8, hierarchy, 0);
  }

  // Step 7️⃣ – Show result
  cv.imshow(canvas, colorEdges);

  // Step 8️⃣ – Label calm text
  ctx.font = "bold 14px Segoe UI";
  ctx.fillStyle = "#6a7a91";
  ctx.fillText("Palm Serenity View", 10, 20);

  // 🧹 Clean memory
  mat.delete(); gray.delete(); edges.delete();
  mask.delete(); cleanEdges.delete();
  colorEdges.delete(); contours.delete(); hierarchy.delete();

  return { serenity: true };
}
