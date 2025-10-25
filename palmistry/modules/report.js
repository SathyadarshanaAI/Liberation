// ===============================
// AI Wisdom Fusion Report — v9.7 (8 Lines + 8 Special Marks)
// ===============================
export function generateFusionReport(data){
  const { lines=[], aura={}, mounts=[], anomalies=[] } = data;

  const L = detectLines(lines);
  const total = Object.keys(L).length;
  const markCount = anomalies.length;

  return `
🪷 **AI Fusion Dharma-Karma Report v9.7**

🖐️ **Main 8 Lines**
1. Heart Line: ${describe(L.heart)}
2. Head Line: ${describe(L.head)}
3. Life Line: ${describe(L.life)}
4. Fate Line: ${describe(L.fate)}
5. Sun (Apollo) Line: ${describe(L.sun)}
6. Mercury Line: ${describe(L.mercury)}
7. Health Line: ${describe(L.health)}
8. Marriage Line: ${describe(L.marriage)}

✨ **8 Special Marks & Symbols**
${renderMarks(anomalies)}

🌙 **Aura & Mounts**
• Aura: ${aura.energy || "neutral"}  
• Mounts detected: ${mounts.join(", ") || "not highlighted"}

💫 **Fusion Insight**
${fusionInsight(L, anomalies, aura)}

🧭 **Summary**
- Total Lines Analyzed: ${total}
- Special Marks: ${markCount}
- Wisdom Coefficient: ${calcWisdom(L, anomalies)}%

⏰ Generated: ${new Date().toLocaleString()}
`;
}

// --- Helper sections ---
function detectLines(arr){
  const keys=["heart","head","life","fate","sun","mercury","health","marriage"];
  const out={};
  keys.forEach(k=>out[k]=arr.find(l=>l.name===k)||{strength:0});
  return out;
}
function describe(l){
  if(!l || !l.strength) return "Not visible / latent energy.";
  if(l.strength>80) return "Radiant and clear — mastery field.";
  if(l.strength>60) return "Stable, refined, well-defined.";
  if(l.strength>40) return "Developing energy — path of balance.";
  return "Faint karmic residue — evolving insight.";
}
function renderMarks(list){
  if(!list.length) return "No unique markings detected.";
  return list.map((m,i)=>`${i+1}. ${m.type} — ${m.meaning}`).join("\n");
}
function calcWisdom(L, anomalies){
  const avg = Object.values(L).reduce((a,l)=>a+(l.strength||0),0)/8;
  const markBonus = anomalies.length * 3;
  return Math.min(100,Math.round(avg/1.2 + markBonus));
}
function fusionInsight(L, anomalies, aura){
  const deep = anomalies.length>3
    ? "Ancient initiatory signs indicate hidden vows or prophetic insight."
    : "Harmonious balance between worldly logic and divine intuition.";
  const auraNote = aura.energy==="radiant"
    ? "Aura field suggests awakened compassion."
    : "Energy field steady and receptive.";
  return `${deep}\n${auraNote}`;
}
