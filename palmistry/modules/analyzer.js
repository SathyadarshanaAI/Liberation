export async function analyzePalm(canvas, hand = "right") {
  // Main palmistry lines & insights (extend as needed)
  const PALM_LINES = [
    { key: "heart", name: "Heart Line", insight: "Emotions, affection, compassion." },
    { key: "head", name: "Head Line", insight: "Intellect, decision-making, creativity." },
    { key: "life", name: "Life Line", insight: "Vitality, life changes, energy." },
    { key: "fate", name: "Fate Line", insight: "Career, destiny, direction." },
    { key: "success", name: "Success Line", insight: "Talent, fame, creativity." },
    { key: "health", name: "Health Line", insight: "Health, business sense, communication." },
    { key: "marriage", name: "Marriage Line", insight: "Relationships, partnership." },
    { key: "manikhanda", name: "Manikhanda (Wrist)", insight: "Fortune, stability, longevity." }
    // Add more lines or marks if needed
  ];

  // For now: Simulate detection. Plug in AI/ML for real detection.
  const lines = PALM_LINES.map(l => ({
    ...l,
    confidence: Math.random() * 0.4 + 0.6, // 60% - 100% confidence (demo)
    details: hand === "left"
      ? "Reflects inherited traits, subconscious, or previous life influences."
      : "Shows present-life actions, choices, and conscious personality."
  }));

  const marks = [
    // For research mode, can detect and add: cross, star, island, chain, square, etc.
    // Example (randomized for demo):
    ...(Math.random() > 0.8 ? [{ type: "cross", position: "on fate line", info: "Significant event or obstacle." }] : []),
    ...(Math.random() > 0.9 ? [{ type: "star", position: "at mount of Jupiter", info: "Sudden fortune or leadership." }] : [])
  ];

  return {
    hand,
    summary: hand === "left"
      ? "Previous Life Traits: Reveals subconscious patterns and inherited qualities from past lives."
      : "Current Life Traits: Reflects conscious choices, present achievements, and how you shape your destiny.",
    lines,
    marks,
    tips: "Palmistry is interpreted differently in various cultures."
  };
}
