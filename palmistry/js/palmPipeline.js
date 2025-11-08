export async function analyzePalmAI(edges, landmarks) {
  // Basic AI logic (combine visual + skeletal)
  const lineCount = countWhitePixels(edges);
  const fingerSpread = landmarks.length ? measureSpread(landmarks) : 0;

  return {
    type: "REAL PALM ANALYSIS",
    lines_detected: lineCount,
    finger_spread: fingerSpread.toFixed(2),
    meaning: interpretPattern(lineCount, fingerSpread)
  };
}

function countWhitePixels(mat) {
  let count = 0;
  for (let r = 0; r < mat.rows; r++) {
    for (let c = 0; c < mat.cols; c++) {
      if (mat.ucharPtr(r, c)[0] > 200) count++;
    }
  }
  return Math.round(count / 1000);
}

function measureSpread(landmarks) {
  if (landmarks.length < 5) return 0;
  return Math.abs(landmarks[0].x - landmarks[4].x) * 100; // thumb to pinky spread
}

function interpretPattern(lines, spread) {
  if (lines > 500 && spread > 25) return "Energetic and open-minded personality";
  if (lines > 500 && spread < 25) return "Deep thinker, prefers solitude";
  if (lines < 400) return "Calm, peaceful temperament";
  return "Balanced and intuitive person";
}
