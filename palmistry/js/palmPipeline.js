import { aiInterpretation } from "./aiCore.js";

export async function analyzePalmAI(edges, landmarks) {
  const data = {
    edgeDensity: edges.rows * edges.cols,
    landmarkCount: landmarks.length,
    pattern:
      landmarks.length > 0
        ? "active-energy"
        : "low-contrast",
  };
  return aiInterpretation(data);
}
