export function detectPastLifeSignature(lines) {
  return {
    identity: "Scholar / Healer",
    influence: lines.heart.strength > 0.7 ? "High" : "Moderate",
  };
}
