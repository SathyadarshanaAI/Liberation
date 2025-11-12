 export async function renderPalmLines3D(frame, canvas) {
  const mat = cv.matFromImageData(frame);
  const hsv = new cv.Mat(), mask = new cv.Mat(), skin = new cv.Mat();
  const gray = new cv.Mat(), blur = new cv.Mat(), edges = new cv.Mat();
  const gradX = new cv.Mat(), gradY = new cv.Mat(), absGradX = new cv.Mat(), absGradY = new cv.Mat(), depth = new cv.Mat();

  const ctx = canvas.getContext("2d");
  const w = canvas.width, h = canvas.height;
  
  // 🎨 Line color spectrum (8 line types)
  const lineColors = [
    [255, 0, 0],     // Life
    [0, 255, 0],     // Head
    [0, 0, 255],     // Heart
    [255, 255, 0],   // Fate
    [255, 0, 255],   // Sun
    [0, 255, 255],   // Mercury
    [255, 165, 0],   // Marriage
    [255, 255, 255]  // Wrist
  ];

  // 1️⃣ Skin extraction
  cv.cvtColor(mat, hsv, cv.COLOR_RGBA2RGB);
  cv.cvtColor(hsv, hsv, cv.COLOR_RGB2HSV);
  const low = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), [0, 20, 70, 0]);
  const high = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), [25, 255, 255, 255]);
  cv.inRange(hsv, low, high, mask);
  cv.bitwise_and(mat, mat, skin, mask);

  // 2️⃣ Convert to gray and smooth
  cv.cvtColor(skin, gray, cv.COLOR_RGBA2GRAY);
  cv.GaussianBlur(gray, blur, new cv.Size(3, 3), 0);

  // 3️⃣ Depth & Gradient for 3D surface
  cv.Sobel(blur, gradX, cv.CV_16S, 1, 0, 3);
  cv.Sobel(blur, gradY, cv.CV_16S, 0, 1, 3);
  cv.convertScaleAbs(gradX, absGradX);
  cv.convertScaleAbs(gradY, absGradY);
  cv.addWeighted(absGradX, 0.5, absGradY, 0.5, 0, depth);

  // 4️⃣ Line extraction
  cv.Canny(blur, edges, 35, 90);

  // 5️⃣ Remove background
  const contours = new cv.MatVector();
  const hierarchy = new cv.Mat();
  cv.findContours(mask, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
  for (let i = 0; i < contours.size(); ++i) {
    const area = cv.contourArea(contours.get(i));
    if (area < 4000) cv.drawContours(edges, contours, i, new cv.Scalar(0, 0, 0, 255), -1);
  }

  // 6️⃣ Draw 3D colored lines
  const edge3D = new cv.Mat.zeros(edges.rows, edges.cols, cv.CV_8UC3);
  for (let i = 0; i < lineColors.length; i++) {
    const temp = new cv.Mat();
    cv.threshold(edges, temp, (i + 1) * 25, 255, cv.THRESH_BINARY);
    const color = new cv.Scalar(...lineColors[i], 255);
    const glow = new cv.Mat();
    cv.dilate(temp, glow, cv.Mat.ones(3, 3, cv.CV_8U));
    cv.cvtColor(glow, glow, cv.COLOR_GRAY2BGR);
    cv.addWeighted(edge3D, 1, glow, 0.2, 0, edge3D);
    glow.delete(); temp.delete();
  }

  // 7️⃣ 3D Light Simulation
  const depthColor = new cv.Mat();
  cv.applyColorMap(depth, depthColor, cv.COLORMAP_JET);
  const palm3D = new cv.Mat();
  cv.addWeighted(skin, 0.8, depthColor, 0.3, 0, palm3D);
  const finalBlend = new cv.Mat();
  cv.addWeighted(palm3D, 0.9, edge3D, 0.7, 0, finalBlend);

  // 8️⃣ Draw final result
  const imgData = new ImageData(new Uint8ClampedArray(finalBlend.data), w, h);
  ctx.putImageData(imgData, 0, 0);

  // 🧹 Cleanup
  mat.delete(); hsv.delete(); mask.delete(); skin.delete();
  gray.delete(); blur.delete(); gradX.delete(); gradY.delete();
  absGradX.delete(); absGradY.delete(); depth.delete();
  edges.delete(); contours.delete(); hierarchy.delete();
  edge3D.delete(); depthColor.delete(); palm3D.delete(); finalBlend.delete();
}
