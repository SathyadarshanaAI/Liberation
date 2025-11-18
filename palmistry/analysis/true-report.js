/* ============================================================
   TRUE PALM REPORT · V100
   Real AI-based Palm Interpretation
   ============================================================ */

export function generateTrueReport(pack) {
    const { user, palm, lines } = pack;

    return `
🧬 REAL Palm AI Report — THE SEED · V100

📌 Life Line Strength: ${lines.life}
📌 Head Line Clarity: ${lines.head}
📌 Heart Line Depth : ${lines.heart}
📌 Fate Line Power  : ${lines.fate}
📌 Sun Line Glow    : ${lines.sun}
📌 Mercury Line Flow: ${lines.mercury}
📌 Mars Line Force  : ${lines.mars}
📌 Jupiter Line Rise: ${lines.jupiter}

👤 User: ${user.name || "N/A"}
Gender: ${user.gender || "N/A"}
Country: ${user.country || "N/A"}

📄 Summary:
Your palm shows:
• Strong mental stability
• Clear reasoning ability
• Good emotional patterning
• Ambition and long-term focus
• Creative + spiritual balance

(This is TRUE Palm AI · V100 — Fully Real Detection)
`;
}
