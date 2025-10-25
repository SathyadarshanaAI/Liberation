// modules/vision.js — V1.0 Real Line Detection Prototype
// © 2025 Sathyadarshana Research Core
// Detects major palm lines using lightweight OpenCV.js pipeline

export async function analyzePalm(canvas) {
  if (!window.cv) {
    console.warn("⚠️ OpenCV.js not loaded — using mock detection");
    return mockDetect();
  }

  const src = cv.imread(canvas);
  const gray = new cv.Mat();
  const blur = new cv.Mat();
  const edges = new cv.Mat();

  // Step 1: Grayscale + blur to reduce noise
  cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
  cv.GaussianBlur(gray, blur, new cv.Size(5, 5), 0, 0, cv.BORDER_DEFAULT);

  // Step 2: Edge detection (Canny)
  cv.Canny(blur, edges, 50, 150, 3, false);

  // Step 3: Contour detection
  const contours = new cv.MatVector();
  const hierarchy = new cv.Mat();
  cv.findContours(edges, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

  const lines = [];
  for (let i = 0; i < contours.size(); i++) {
    const c = contours.get(i);
    const rect = cv.boundingRect(c);
    const area = cv.contourArea(c);
    if (area < 500 || area > 50000) continue; // skip noise/small blobs

    // heuristic mapping by region (top, mid, bottom)
    const y = rect.y + rect.height / 2;
    const h = canvas.height;
    const zone = y < h * 0.33 ? "Heart Line" :
                 y < h * 0.66 ? "Head Line" :
                 "Life Line";

    lines.push({
      zone,
      length: rect.width,
      thickness: rect.height,
      area,
      curvature: +(rect.height / rect.width).toFixed(2),
      posY: +(y / h).toFixed(2)
    });
  }

  // Cleanup
  src.delete(); gray.delete(); blur.delete(); edges.delete(); contours.delete(); hierarchy.delete();

  return summarize(lines);
}

// --- Summarize features into interpreted data -------------------------------
function summarize(lines) {
  const report = [];

  const findLine = name => lines.filter(l => l.zone === name);
  const heart = findLine("Heart Line")[0];
  const head = findLine("Head Line")[0];
  const life = findLine("Life Line")[0];

  if (heart) {
    report.push({
      name: "Heart Line",
      meaning:
        heart.curvature > 0.3
          ? "Emotional, compassionate nature; heart guides decisions."
          : "Rational and calm in emotional matters."
    });
  }

  if (head) {
    report.push({
      name: "Head Line",
      meaning:
        head.length > 300
          ? "Strong analytical thinking and creativity."
          : "Simple, practical, and intuitive mindset."
    });
  }

  if (life) {
    report.push({
      name: "Life Line",
      meaning:
        life.length > 280
          ? "Robust vitality and endurance; long energetic life."
          : "Moderate vitality; reflective and spiritual focus."
    });
  }

  // Manikanda / Fate (future extension)
  if (lines.length > 6) {
    report.push({
      name: "Manikanda Line",
      meaning: "Spiritual protection; guided by unseen guardians."
    });
  }

  return {
    timestamp: new Date().toISOString(),
    linesDetected: lines.length,
    features: lines,
    interpretation: report
  };
}

// --- Mock fallback if OpenCV not available ---------------------------------
function mockDetect() {
  return {
    timestamp: new Date().toISOString(),
    linesDetected: 3,
    features: [
      { zone: "Heart Line", length: 320, curvature: 0.4 },
      { zone: "Head Line", length: 310, curvature: 0.2 },
      { zone: "Life Line", length: 350, curvature: 0.25 }
    ],
    interpretation: [
      { name: "Heart Line", meaning: "Warm, expressive nature, deep empathy." },
      { name: "Head Line", meaning: "Balanced logic and intuition." },
      { name: "Life Line", meaning: "Strong vitality and enduring strength." }
    ]
  };
}
