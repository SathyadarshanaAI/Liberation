// 🕉️ Sathyadarshana • THE SEED Palmistry Engine
// FINAL REPORT ENGINE V1.0 — "THE GEM"

export function generatePalmReport(lines, mounts, aura) {

  function meaning(value) {
    if (value >= 0.75) return "Strong, stable, clearly expressed";
    if (value >= 0.45) return "Moderate and steady";
    if (value >= 0.20) return "Weak, faint, or inconsistent";
    return "Very low or blocked";
  }

  const report = {
    lifeLine: {
      strength: lines.life,
      meaning: meaning(lines.life),
      message:
        lines.life >= 0.75
          ? "Your life-force is powerful and enduring. You recover from hardship strongly."
          : lines.life >= 0.45
          ? "You have a balanced vitality but need to manage energy wisely."
          : "Your prāṇa flow is sensitive; rest, breathing, and healing practices help."
    },

    headLine: {
      strength: lines.head,
      meaning: meaning(lines.head),
      message:
        lines.head >= 0.75
          ? "A sharp, deep-thinking mind with natural strategy and intuition."
          : lines.head >= 0.45
          ? "Your thinking is balanced but sometimes divided."
          : "Your mental energy is sensitive; meditation increases stability."
    },

    heartLine: {
      strength: lines.heart,
      meaning: meaning(lines.heart),
      message:
        lines.heart >= 0.75
          ? "A deep-hearted person with intense emotional intelligence."
          : lines.heart >= 0.45
          ? "You care deeply but protect yourself at times."
          : "Your emotions stay guarded; healing and self-love are key."
    },

    fateLine: {
      strength: lines.fate,
      meaning: meaning(lines.fate),
      message:
        lines.fate >= 0.75
          ? "A strong destiny path. You follow a divine calling."
          : lines.fate >= 0.45
          ? "Your life path is steady but influenced by choices."
          : "Your destiny is flexible; nothing is fixed — you create your path."
    },

    mounts: {
      jupiter: meaning(mounts.jupiter),
      saturn: meaning(mounts.saturn),
      apollo: meaning(mounts.apollo),
      mercury: meaning(mounts.mercury),
      mars_upper: meaning(mounts.mars_upper),
      mars_lower: meaning(mounts.mars_lower),
      venus: meaning(mounts.venus),
      moon: meaning(mounts.moon)
    },

    auraField: {
      upper: {
        level: aura.upper,
        meaning: aura.upper > 0.70 ? "Emotional aura glowing strong" :
                 aura.upper > 0.40 ? "Emotionally balanced" :
                                     "Sensitive emotional field"
      },
      middle: {
        level: aura.middle,
        meaning: aura.middle > 0.70 ? "Focused and mentally bright" :
                 aura.middle > 0.40 ? "Balanced mind" :
                                     "Stress-prone mindfield"
      },
      lower: {
        level: aura.lower,
        meaning: aura.lower > 0.70 ? "Powerful life-force" :
                 aura.lower > 0.40 ? "Stable vitality" :
                                     "Low prāṇa; needs restoration"
      }
    },

    finalMessage:
      lines.life >= 0.7 && aura.lower >= 0.7
        ? "You carry a rare radiance — a soul with strong life-force and purpose."
        : aura.upper >= 0.7
        ? "Your emotional aura is powerful; compassion is your spiritual weapon."
        : "You are evolving — your energy is shifting toward a higher path."
  };

  return report;
}
