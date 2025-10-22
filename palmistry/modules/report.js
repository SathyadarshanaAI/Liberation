// modules/report.js
export function generatePalmReport(data, mode = "short") {
  const { hand, life, head, heart, fate, sun, health, marriage, bracelet } = data;
  const lang = data.lang || "English";

  if (mode === "short") {
    return `
🪶 <strong>${hand} Hand Reading – Summary</strong><br><br>
Your ${hand.toLowerCase()} hand shows a mind of balance and depth. 
The <b>Life Line</b> reveals endurance and adaptability through change. 
The <b>Head Line</b> moves gracefully, showing inner reflection and creative thought. 
The <b>Heart Line</b> curves warmly, marking compassion and sincerity in relationships. 
The <b>Fate Line</b> is subtle, yet it suggests that destiny is shaped by your effort and faith. 
Together these lines reflect calm strength, wisdom born from solitude, 
and a journey where inner truth becomes your guiding star.
    `;
  }

  // ----- Detailed Report -----
  return `
🌿 <strong>${hand} Hand – Detailed Palmistry Analysis</strong><br><br>

<b>1. Life Line:</b> ${life || "Long and steady, showing endurance and vitality."}<br>
<b>2. Head Line:</b> ${head || "Curved toward the moon, revealing deep imagination and reflection."}<br>
<b>3. Heart Line:</b> ${heart || "Clear and warm, representing compassion and emotional wisdom."}<br>
<b>4. Fate Line:</b> ${fate || "Faint but independent, suggesting a self-directed destiny."}<br>
<b>5. Sun Line:</b> ${sun || "Moderate clarity, showing success through persistence and inner light."}<br>
<b>6. Health Line:</b> ${health || "Stable, though occasional stress may reflect sensitivity to emotions."}<br>
<b>7. Marriage Line:</b> ${marriage || "Short and firm, indicating loyalty and emotional depth."}<br>
<b>8. Bracelet Lines:</b> ${bracelet || "Well-defined, showing spiritual grounding and inherited strength."}<br><br>

🕊️ Overall, the pattern of your hand suggests harmony between intellect, emotion, and destiny. 
Periods of solitude will bring insight, and service to others will unlock greater peace.
  `;
}
