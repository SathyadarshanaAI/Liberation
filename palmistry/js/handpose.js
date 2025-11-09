import * as handpose from "https://cdn.jsdelivr.net/npm/@tensorflow-models/handpose";
import "@tensorflow/tfjs-backend-webgl";

let model;
export async function detectHandLandmarks(video) {
  if (!model) {
    model = await handpose.load();
  }
  const predictions = await model.estimateHands(video);
  return predictions.length ? predictions[0].landmarks : [];
}
