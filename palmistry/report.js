export async function generateMiniReport(img, side) {
  const lines = side === "left"
    ? "represents your emotional and inherited nature"
    : "reveals your practical and life direction energy";

  const insights = [
    "Your life line suggests a strong vitality and willpower.",
    "The head line shows deep thinking and creative insight.",
    "Your heart line reveals warmth and empathy.",
    "There is evidence of strong intuitive ability and foresight."
  ];

  const mix = insights.sort(() => 0.5 - Math.random()).slice(0, 3).join(" ");
  return `This ${side} hand ${lines}. ${mix} Together they show balance between mind and heart.`;
}
