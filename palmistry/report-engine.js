/* =====================================================
   THE SEED · Palmistry AI · Report Engine · V80
   Compatible With 8-Line Extractor
   ===================================================== */

export async function generateReport({ user, palm, lines }) {

    console.log("📌 Report Engine Received:", { user, palm, lines });

    // SAFETY GUARDS
    if (!lines || typeof lines !== "object") {
        return "❌ Line data missing!";
    }

    // Ensure ALL 8 lines exist
    const safe = (v) => v !== undefined ? v : "0.000";

    const L = {
        life: safe(lines.life),
        head: safe(lines.head),
        heart: safe(lines.heart),
        fate: safe(lines.fate),
        sun: safe(lines.sun),
        mercury: safe(lines.mercury),
        marriage: safe(lines.marriage),
        health: safe(lines.health)
    };

    return `
🧬 PALMISTRY REPORT — THE SEED V80
======================================

👤 USER PROFILE
• Name: ${user?.name || "N/A"}
• Gender: ${user?.gender || "N/A"}
• DOB: ${user?.dob || "N/A"}
• Country: ${user?.country || "N/A"}
• Hand Scanned: ${user?.hand || "N/A"}

--------------------------------------

🖐️ PALM LINE SUMMARY (8 LINES)

🌱 Life Line      : ${L.life}
🧠 Head Line      : ${L.head}
❤️ Heart Line     : ${L.heart}
🎚 Fate Line      : ${L.fate}
☀️ Sun Line       : ${L.sun}
📡 Mercury Line   : ${L.mercury}
💍 Marriage Line  : ${L.marriage}
⚕ Health Line    : ${L.health}

--------------------------------------

🔮 AI Interpretation Module:
(Next version will include real ML-based palm pattern analysis.)

📌 THE SEED — Build 80
    `.trim();
}
