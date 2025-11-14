/* ---------------------------------------------------------
   THE SEED · Palmistry AI
   palm-core.js — Palm Line Meaning + AI Logic (v1.0)

   Input:
     lines = {
       life, head, heart, fate,
       sun, mercury, marriage, health
     }

   Output:
     structured reading object:
     {
       life: "...",
       head: "...",
       heart: "...",
       fate: "...",
       sun: "...",
       mercury: "...",
       marriage: "...",
       health: "...",
       summary: "..."
     }
----------------------------------------------------------*/

export function palmAnalysis(lines) {

  function interpretLine(lineY, type) {

    if (!lineY || lineY <= 0)
      return `⚠ ${type} line not clearly detected.`;

    // lineY → relative vertical position
    const pos = lineY;

    switch(type) {

      case "Life":
        if (pos > 250) return "Strong vitality, high endurance, emotionally grounded.";
        if (pos > 180) return "Balanced health and a calm, steady approach to life.";
        return "Sensitive constitution, but spiritually deep and intuitive.";

      case "Head":
        if (pos > 230) return "Creative thinker, visual imagination, emotional intelligence.";
        if (pos > 170) return "Balanced logic and creativity.";
        return "High intellect, analytical, fast decision maker.";

      case "Heart":
        if (pos > 200) return "Warm-hearted, loyal, deeply emotional.";
        if (pos > 150) return "Balanced romantic nature with stable emotions.";
        return "Protective heart, careful with trust, but deeply loving.";

      case "Fate":
        if (pos > 240) return "Life path influenced by external forces.";
        if (pos > 170) return "Strong destiny line — self-driven future.";
        return "Independent destiny — creates own path.";

      case "Sun":
        if (pos > 200) return "Creative talent, artistic instincts, potential recognition.";
        if (pos > 150) return "Stable creativity and balanced fame energy.";
        return "High charisma, spiritual shine, natural leadership.";

      case "Mercury":
        if (pos > 200) return "Excellent communication, helpful career potential.";
        if (pos > 150) return "Balanced social intelligence.";
        return "Analytical communicator; strong teaching or healing ability.";

      case "Marriage":
        if (pos > 60) return "Deep partnership, emotional loyalty.";
        if (pos > 40) return "Balanced relationships with mutual respect.";
        return "Protective in love; high emotional sensitivity.";

      case "Health":
        if (pos > 260) return "Strong physical resilience.";
        if (pos > 200) return "Generally good health and stable energy.";
        return "Sensitive body, but strong mental and spiritual endurance.";

      default:
        return "Unknown line.";
    }
  }

  /* ---------------------------------------------------------
     GENERATE FULL READING
  ----------------------------------------------------------*/

  const reading = {
    life: interpretLine(lines.life, "Life"),
    head: interpretLine(lines.head, "Head"),
    heart: interpretLine(lines.heart, "Heart"),
    fate: interpretLine(lines.fate, "Fate"),
    sun: interpretLine(lines.sun, "Sun"),
    mercury: interpretLine(lines.mercury, "Mercury"),
    marriage: interpretLine(lines.marriage, "Marriage"),
    health: interpretLine(lines.health, "Health"),
  };

  /* ---------------------------------------------------------
     SUMMARY — AI Fusion Interpretation
  ----------------------------------------------------------*/
  reading.summary =
    `Your palm indicates a blend of ${reading.life.toLowerCase()}, ` +
    `${reading.head.toLowerCase()}, and ${reading.heart.toLowerCase()}. ` +
    `Your destiny energy suggests: ${reading.fate.toLowerCase()}.`;

  return reading;
}
