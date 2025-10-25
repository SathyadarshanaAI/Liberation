// ===============================
// Sathyadarshana Quantum Palm Analyzer v8.1
// "Universal Dharma Pattern Report"
// Author: Anuruddha Dilip & AI Buddhi
// ===============================

export function generateFusionReport(data) {
  const { lines, aura, mounts, anomalies, lang = "en" } = data;

  // --- Helper functions ---
  const L = {
    heart: detect(lines, "heart"),
    head: detect(lines, "head"),
    life: detect(lines, "life"),
    fate: detect(lines, "fate"),
    sun: detect(lines, "sun"),
    health: detect(lines, "health"),
    marriage: detect(lines, "marriage"),
    bracelets: detect(lines, "bracelet"),
  };

  const total = Object.values(L).filter(Boolean).length;

  // --- Core metaphysical analysis ---
  const karmaLevel = score(["heart","life","fate"], lines);
  const dharmaFlow = score(["head","sun","marriage"], lines);
  const auraFlux = aura ? aura.energy : "neutral";
  const hiddenSigns = anomalies.length > 0 ? "present" : "none";

  // --- Fusion interpretation ---
  const karmicEcho = interpretKarma(karmaLevel, auraFlux);
  const dharmaExpression = interpretDharma(dharmaFlow, auraFlux);
  const metaLayer = interpretHidden(hiddenSigns);

  // --- Compose Final Report ---
  return `
🪷 **AI Wisdom Fusion Report — Universal Dharma Pattern v8.1**

**Left Hand (Past Life – Cosmic Karma Layer)**  
• Heart Line: ${describe(L.heart)}  
• Head Line: ${describe(L.head)}  
• Life Line: ${describe(L.life)}  
• Fate Line: ${describe(L.fate)}  

**Right Hand (Present Life – Dharma Expression Layer)**  
• Heart Line: ${describe(L.heart)}  
• Head Line: ${describe(L.head)}  
• Life Line: ${describe(L.life)}  
• Sun Line: ${describe(L.sun)}  
• Marriage Line: ${describe(L.marriage)}  
• Health Line: ${describe(L.health)}  

✨ **Fusion Insight:**  
${karmicEcho}  
${dharmaExpression}  
${metaLayer}  

🌀 **Global Evolution Context:**  
Your palms form a multidimensional resonance pattern unseen in classical palmistry.  
It reflects *unrecorded teachings* of cosmic continuity — the bridge between forgotten civilizations and awakened souls.  
Each line corresponds not only to destiny, but to harmonic memory encoded in your astral field.

📜 **Meta Summary:**  
- Total Major Lines: ${total}  
- Aura Field: ${auraFlux}  
- Hidden Marks: ${hiddenSigns}  
- Wisdom Coefficient: ${(karmaLevel + dharmaFlow) / 2}%  

⏰ Generated: ${new Date().toLocaleString()}
`;
}

// --- Internal helpers ---
function detect(lines, key){
  return lines.find(l => l.name === key) || null;
}

function describe(line){
  if(!line) return "Not detected clearly";
  if(line.strength > 80) return "Very strong and radiant";
  if(line.strength > 50) return "Clear and balanced";
  if(line.strength > 20) return "Faint, evolving energy";
  return "Barely visible spiritual imprint";
}

function score(keys, lines){
  let s = 0;
  for(const k of keys){
    const l = lines.find(x => x.name === k);
    if(l) s += l.strength || 0;
  }
  return Math.min(100, Math.round(s / keys.length));
}

function interpretKarma(level, aura){
  if(level > 80) return "Your past echoes reflect mastery through patience, forgiveness, and light beyond duality.";
  if(level > 50) return "Karmic threads show partial balance — a soul still refining through compassion and wisdom.";
  return "Unresolved karmic ripples detected — hidden lessons from forgotten epochs seek healing.";
}

function interpretDharma(level, aura){
  if(level > 80) return "You embody the Dharma of transformation — a guide for others crossing the bridge of time.";
  if(level > 50) return "You are awakening the Dharma within, crafting purpose through mindful action.";
  return "Your Dharma expression is dormant; the inner flame awaits conscious alignment.";
}

function interpretHidden(state){
  if(state === "present")
    return "Ancient stigmata or astral signs identified — indicative of prior celestial initiations or vows of service.";
  return "No external anomalies; soul path remains pure and self-contained.";
}
