// vision/palm-detect.js
// Minimal palm detection stub: returns bounding box + grayscale image data

export async function detectPalm(frameImageData) {
  // frameImageData = ImageData
  // Simple heuristic: return the whole frame as "palm region"
  // A real implementation would run ML or edge-detection.
  return {
    bbox: { x: 0, y: 0, w: frameImageData.width, h: frameImageData.height },
    imageData: frameImageData
  };
}
