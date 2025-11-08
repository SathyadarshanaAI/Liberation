let detector;

export async function detectHandLandmarks(video) {
  if (!detector) {
    const model = handPoseDetection.SupportedModels.MediaPipeHands;
    const config = {
      runtime: "mediapipe",
      modelType: "full",
      solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/hands"
    };
    detector = await handPoseDetection.createDetector(model, config);
  }

  const hands = await detector.estimateHands(video);
  return hands.length > 0 ? hands[0].keypoints3D : [];
}
