/* =====================================================
   THE SEED · Palmistry AI · Report Engine · V80
   ===================================================== */

export function generateReport(data) {

    const L = data.lines;

    return `
🔮 Palmistry AI Report — THE SEED · V80

📌 Life Line Strength: ${L.life}
📌 Head Line Clarity: ${L.head}
📌 Heart Line Depth : ${L.heart}
📌 Fate Line Power  : ${L.fate}
📌 Sun Line Glow    : ${L.sun}
📌 Mercury Line Flow: ${L.mercury}
📌 Mars Line Force  : ${L.mars}
📌 Jupiter Line Rise: ${L.jupiter}

🧍 User: ${data.user.name || "N/A"}
Gender: ${data.user.gender || "N/A"}
Country: ${data.user.country || "N/A"}

📝 Summary:
Your palm lines show:
• Strong leadership potential
• Independent decision-making
• Sharp long-term thinking
• Stable emotional structure

(This is V80 Base Report · The full Real Palm AI Module comes next)
`;
}
