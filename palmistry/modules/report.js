// modules/report.js — Sathyadarshana Quantum Palm Analyzer · V10.0 Advanced Core
// © 2025 Sathyadarshana Research Core
// Fully tuned for AI-grade analysis, multilingual narration & fusion insight.

export function generateFusionReport(data = {}) {
  const lines = data.lines || [];
  const aura  = data.aura  || { energy: "neutral" };
  const mounts = data.mounts || [];
  const anomalies = data.anomalies || [];

  let report = "";
  report += "🕉️ SATHYADARSHANA QUANTUM PALM ANALYZER · AI FUSION REPORT\n";
  report += "────────────────────────────────────────────\n\n";

  // === SECTION 1: LINE STRENGTHS ===
  if (!lines.length) {
    report += "⚠️ No palm line data detected.\nPlease capture both hands to continue.\n\n";
  } else {
    report += "📊 PRIMARY LINE ANALYSIS\n";
    lines.forEach(l => {
      report += `• ${capitalize(l.name)} Line → Strength ${l.strength}%\n`;
    });
    report += "\n";
  }

  // === SECTION 2: AURA & ENERGY FIELD ===
  report += "🌌 ENERGY FIELD & AURA\n";
  report += `→ Detected Aura State: ${aura.energy.toUpperCase()}\n`;
  if (aura.energy === "radiant") {
    report += "✨ Your energy field shows positive radiation; the inner life-force flows harmoniously.\n";
  } else if (aura.energy === "dim") {
    report += "🌑 Energy vibrations appear weakened — rest, meditation, and silence are advised.\n";
  } else {
    report += "🌗 Balanced aura – neither overcharged nor depleted.\n";
  }
  report += "\n";

  // === SECTION 3: MOUNTS ===
  if (mounts.length) {
    report += "⛰️ PLANETARY MOUNTS\n";
    for (const m of mounts) {
      report += `• Mount of ${capitalize(m.name)}: ${m.state}\n`;
    }
    report += "\n";
  }

  // === SECTION 4: ANOMALIES ===
  if (anomalies.length) {
    report += "⚡ SPECIAL MARKINGS & ANOMALIES\n";
    for (const a of anomalies) {
      report += `• ${a.type} observed near ${a.location}\n`;
    }
    report += "\n";
  }

  // === SECTION 5: COMBINED INSIGHT ===
  const life = getLine(lines, "life");
  const heart = getLine(lines, "heart");
  const head = getLine(lines, "head");
  const fate = getLine(lines, "fate");

  report += "🧠 COMBINED INSIGHT\n";
  if (life && heart && head) {
    if (life.strength > 80 && heart.strength > 70) {
      report += "💖 A strong life and heart synergy indicate courage guided by compassion.\n";
    } else if (head.strength > 80 && fate && fate.strength < 60) {
      report += "🔮 Sharp intellect with a challenging destiny — spiritual endurance required.\n";
    } else {
      report += "⚖️ Moderate balance between vitality, emotion, and thought.\n";
    }
  } else {
    report += "🕊️ Partial data – deeper capture may reveal higher harmony patterns.\n";
  }
  report += "\n";

  // === SECTION 6: CONCLUSION ===
  report += "💫 SUMMARY\n";
  report += "The palm reveals a map of the soul – each line a pulse of karma.\n";
  report += "Where intention and destiny meet, there arises the path of Light.\n";
  report += "May Sathyadarshana illuminate your journey through all realms.\n";
  report += "\n────────────────────────────────────────────\n";

  return report;
}

// --- Helper Functions ---
function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
}

function getLine(lines, name) {
  return lines.find(l => l.name.toLowerCase() === name.toLowerCase());
}
