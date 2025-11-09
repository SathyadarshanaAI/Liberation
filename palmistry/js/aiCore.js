export function aiInterpretation(data) {
  let report = {};

  if (data.pattern === "active-energy") {
    report.personality = "High vital force — your palm shows dynamic life energy.";
    report.path = "Driven by insight and higher knowledge.";
    report.health = "Good circulation, steady nervous balance.";
  } else {
    report.personality = "Calm, introspective, sensitive to vibration.";
    report.path = "Inner development, spiritual clarity needed.";
    report.health = "Prone to fatigue or emotional overuse.";
  }

  report.meta = {
    edgeDensity: data.edgeDensity,
    landmarksDetected: data.landmarkCount,
  };

  return report;
}
