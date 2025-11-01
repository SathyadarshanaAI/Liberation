// 🧠 AI Buddhi – Dharma Palm Analyzer Brain
export function analyzePalm() {
  const lines = [
    "💖 **Heart Line:** Deep compassion and emotional clarity flow through you.",
    "🌿 **Life Line:** Strong spiritual endurance and protection from divine grace.",
    "🔥 **Fate Line:** A guiding cosmic purpose defines your journey.",
    "☀️ **Sun Line:** Your creative light shines beyond material limits.",
    "🌙 **Head Line:** Calm wisdom and meditative understanding shape your mind."
  ];
  const random = Math.floor(Math.random() * lines.length);
  return `🔮 *AI Buddhi Dharma Report*\n──────────────────────────\n${lines[random]}\n\n🕉️ Generated: ${new Date().toLocaleTimeString()}`;
}
