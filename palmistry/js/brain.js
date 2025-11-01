export function analyzePalm() {
  const lines = [
    "💖 Heart Line: Deep compassion and emotional clarity flow through you.",
    "🌿 Life Line: Strong endurance and divine grace protect you.",
    "🔥 Fate Line: A guiding cosmic purpose defines your path.",
    "☀️ Sun Line: Your creative light shines beyond material limits.",
    "🌙 Head Line: Calm wisdom and meditative insight shape your mind."
  ];
  const i = Math.floor(Math.random() * lines.length);
  return `🔮 AI Buddhi Dharma Report\n────────────────────────\n${lines[i]}\n\n🕉️ ${new Date().toLocaleTimeString()}`;
}
