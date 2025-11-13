export function analyzeKarma(lines) {
  let karmicCycle = "neutral";

  if (lines.fate.present === false) karmicCycle = "positive";
  if (lines.life.strength < 0.5) karmicCycle = "negative";

  return {
    karmicCycle,
    lesson:
      karmicCycle === "positive"
        ? "You have earned blessings from past actions."
        : karmicCycle === "negative"
        ? "Your soul seeks discipline and compassion."
        : "Your karmic balance is stable.",
  };
}
