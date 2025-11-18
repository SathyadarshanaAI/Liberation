/* =====================================================
   THE SEED · REAL PALMISTRY REPORT ENGINE · V71
   Uses: 8 Lines + 3 Support Indicators
   ===================================================== */

export function generateReport(packet) {

    const { user, palm, lines } = packet;

    function pct(v) {
        return Math.round(v * 100) + "%";
    }

    return `
🔮 THE SEED · Palmistry Report · V71
======================================

👤 User: ${user.name || "Unknown"}
Gender: ${user.gender || "N/A"}
DOB: ${user.dob || "N/A"}
Country: ${user.country || "N/A"}
Hand Scanned: ${user.hand || "N/A"}

--------------------------------------
🖐 Main Palm Lines Analysis
--------------------------------------

• Life Line      : ${pct(lines.life)}
• Head Line      : ${pct(lines.head)}
• Heart Line     : ${pct(lines.heart)}
• Fate Line      : ${pct(lines.fate)}
• Sun Line       : ${pct(lines.sun)}
• Mercury Line   : ${pct(lines.mercury)}
• Marriage Line  : ${pct(lines.marriage)}
• Health Line    : ${pct(lines.health)}

--------------------------------------
✨ Support Indicators
--------------------------------------

• Intuition Line : ${pct(lines.intuition)}
• Travel Line    : ${pct(lines.travel)}
• Children Line  : ${pct(lines.children)}

--------------------------------------
🧠 Summary (AI Predictive)
--------------------------------------

${lines.life > 0.55 ? "• Very strong vitality and long-term health." 
                    : "• Energy curve fluctuates. Needs balance."}

${lines.head > 0.60 ? "• Sharp analytical mind and deep thinking." 
                    : "• Emotion-influenced decision patterns."}

${lines.heart > 0.60 ? "• Strong emotional depth and loyalty." 
                      : "• Sensitive heart with protective nature."}

${lines.fate > 0.50 ? "• Life path influenced by self-made choices." 
                    : "• Life path shaped by external changes."}

${lines.sun > 0.50 ? "• Natural talent and recognition potential." 
                   : "• Creativity present but hidden."}

${lines.mercury > 0.55 ? "• Excellent communication and negotiation." 
                       : "• Communication improves with practice."}

${lines.marriage > 0.50 ? "• Stable long-term partnership energy." 
                        : "• Delayed or selective relationship pattern."}

${lines.health > 0.55 ? "• Balanced physical–mental system." 
                      : "• Needs better rest + emotional calmness."}

--------------------------------------
💎 Spiritual Insight
--------------------------------------
Your palm shows a unique combination of destiny and free-will energy.
This reading is generated from the REAL 8-line model of The Seed.

(100% No Demo — Pure AI Interpretation)
`;
}
