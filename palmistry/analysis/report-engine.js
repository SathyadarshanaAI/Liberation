/* =====================================================
   THE SEED · Palmistry AI · Report Engine · V80 (Fix)
   ===================================================== */

export function generateReport(data) {

    const { user, palm, lines } = data;

    return `
🔮 Palmistry AI Report — THE SEED · V80

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

📝 Summary:
Your palm lines show:
• Strong leadership potential  
• Independent decision-making  
• Sharp long-term thinking  
• Stable emotional structure  

(This is V80 Base Report · The full Real Palm AI Module comes next)
`;
}
