export function generateHealingAdvice(pattern) {
  const advice = {
    positive: "Your energy is aligned. Continue compassion and mindfulness.",
    neutral: "You are stable, but inner healing will elevate your consciousness.",
    negative: "Release old pain. Forgive. Rebuild your spiritual core.",
  };

  return advice[pattern] || "Observe your mind. Healing begins with awareness.";
}
