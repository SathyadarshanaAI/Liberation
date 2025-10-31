// 🧠 AI Brain Module — Dharma Logic Engine V1.0
export function analyzePalmPatterns(ctx) {
  // mock pixel scan — future version will read actual line clusters
  const data = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  const avg = data.data.reduce((a, v) => a + v, 0) / data.data.length;

  // simple logic placeholder
  if (avg > 140000) return "Strong solar energy — visionary leadership.";
  if (avg > 120000) return "Balanced aura — calm reasoning and empathy.";
  if (avg > 90000)  return "Creative intuition guiding practical mind.";
  return "Subtle karmic vibrations — introspection and healing.";
}

// generates AI dharma insight blending brain output
export function brainInsight(baseMsg, levelMsg) {
  const templates = [
    `🕉️ ${baseMsg} Your inner aura reveals ${levelMsg}`,
    `💫 ${levelMsg} — aligned with the Dharma path.`,
    `🔮 ${baseMsg} This indicates ${levelMsg.toLowerCase()}`,
    `✨ Within your palm lies ${levelMsg.toLowerCase()}`
  ];
  return templates[Math.floor(Math.random() * templates.length)];
}
