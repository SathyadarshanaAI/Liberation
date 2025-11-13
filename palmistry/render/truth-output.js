export function createTruthReport(data) {
  return {
    status: "complete",
    soulSignature: {
      element: data.palm.shape,
      aura: data.aura.auraColor,
      pastLife: data.pastlife.identity
    },
    karma: data.karma,
    tendencies: data.tendencies,
    healing: data.heal,
    analysisConfidence: (
      (data.lines.life.strength +
        data.lines.head.strength +
        data.lines.heart.strength) / 3
    ).toFixed(2)
  };
}
