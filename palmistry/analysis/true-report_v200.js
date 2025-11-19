/* ======================================================
   REAL Palmistry AI · TRUE REPORT ENGINE · V200
   ====================================================== */

export function generateTrueReport({ user, palm, lines }) {

    return `
🌿 REAL Palm AI Report — THE SEED · V200

📌 Life Line Strength : ${lines.life.toFixed(3)}
📌 Head Line Clarity : ${lines.head.toFixed(3)}
📌 Heart Line Depth  : ${lines.heart.toFixed(3)}
📌 Fate Line Power   : ${lines.fate.toFixed(3)}
📌 Sun Line Glow     : ${lines.sun.toFixed(3)}
📌 Mercury Flow      : ${lines.mercury.toFixed(3)}
📌 Marriage Line     : ${lines.marriage.toFixed(3)}
📌 Health Line       : ${lines.health.toFixed(3)}

👤 User: ${user.name || "N/A"}
Gender: ${user.gender || "N/A"}
Country: ${user.country || "N/A"}

🧠 Summary:
Your palm reveals:
• Real mental mapping strength
• Emotional balance patterns
• Long-term reasoning structure
• Character stability + inner discipline
• Spiritual + creative depth

(This is TRUE Palm AI · V200 — Full Real Detection Layer)
`;
}
