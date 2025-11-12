export async function renderNaturalPalm3D(frame, canvas) {
  const mat = cv.matFromImageData(frame);
  const hsv = new cv.Mat();
  const mask = new cv.Mat();
  const skin = new cv.Mat();
  const gray = new cv.Mat();
  const blur = new cv.Mat();
  const edges = new cv.Mat();
  const depth = new cv.Mat();

  const ctx = canvas.getContext("2d");
  const colors = [
    [255, 0, 0],     // Life line
    [0, 255, 0],     // Head line
    [0, 0, 255],     // Heart line
    [255, 255, 0],   // Fate line
    [255, 0, 255],   // Sun line
    [0, 255, 255],   // Mercury line
    [255, 165, 0],   // Marriage line
    [255, 255, 255]  // Wrist line
  ];

  // 1️⃣ Convert & isolate skin region
  cv.cvtColor(mat, hsv, cv.COLOR_RGBA2RGB);
  cv.cvtColor(hsv, hsv, cv.COLOR_RGB2HSV);
  const low = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), [0, 20, 70, 0]);
  const high = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), [25, 255, 255, 255]);
  cv.inRange(hsv, low, high, mask);
  cv.bitwise_and(mat, mat, skin, mask);

  // 2️⃣ Prepare for 3D depth + line detection
  cv.cvtColor(skin, gray, cv.COLOR_RGBA2GRAY);
  cv.GaussianBlur(gray, blur, new cv.Size(3, 3), 0);

  // Depth estimate using Sobel gradients
  const gradX = new cv.Mat();
  const gradY = new cv.Mat();
  const absGradX = new cv.Mat();
  const absGradY = new cv.Mat();
  cv.Sobel(blur, gradX, cv.CV_16S, 1, 0, 3);
  cv.Sobel(blur, gradY, cv.CV_16S, 0, 1, 3);
  cv.convertScaleAbs(gradX, absGradX);
  cv.convertScaleAbs(gradY, absGradY);
  cv.addWeighted(absGradX, 0.5, absGradY, 0.5, 0, depth);

  // Edge detection for line structure
  cv.Canny(blur, edges, 35, 90);

  // 3️⃣ Remove outer area
  const contours = new cv.MatVector();
  const hierarchy = new cv.Mat();
  cv.findContours(mask, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
  for (let i = 0; i < contours.size(); ++i) {
    const area = cv.contourArea(contours.get(i));
    if (area < 5000) cv.drawContours(edges, contours, i, new cv.Scalar(0, 0, 0, 255), -1);
  }

  // 4️⃣ Combine depth with colored line map
  const edgeColored = new cv.Mat.zeros(edges.rows, edges.cols, cv.CV_8UC3);
  for (let i = 0; i < colors.length; i++) {
    const temp = new cv.Mat();
    cv.threshold(edges, temp, (i + 1) * 25, 255, cv.THRESH_BINARY);
    const color = new cv.Scalar(...colors[i], 255);
    cv.bitwise_or(edgeColored, edgeColored, edgeColored);
    cv.addWeighted(edgeColored, 1, edgeColored, 0, 0, edgeColored);
    cv.cvtColor(temp, temp, cv.COLOR_GRAY2BGR);
    cv.addWeighted(edgeColored, 1, temp, 0.3, 0, edgeColored);
    temp.delete();
  }

  // 5️⃣ Blend all layers (natural hand + 3D depth + color lines)
  const blend1 = new cv.Mat();
  const blend2 = new cv.Mat();
  cv.addWeighted(skin, 0.85, edgeColored, 0.7, 0, blend1);
  cv.addWeighted(blend1, 1, depth, 0.4, 0, blend2);

  // 6️⃣ Display on canvas
  const imgData = new ImageData(new Uint8ClampedArray(blend2.data), canvas.width, canvas.height);
  ctx.putImageData(imgData, 0, 0);

  // 🧹 Cleanup
  mat.delete(); hsv.delete(); mask.delete(); skin.delete();
  gray.delete(); blur.delete(); edges.delete(); gradX.delete(); gradY.delete();
  absGradX.delete(); absGradY.delete(); contours.delete(); hierarchy.delete();
  depth.delete(); edgeColored.delete(); blend1.delete(); blend2.delete();
}
