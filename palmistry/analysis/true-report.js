/* ==========================================================
   THE SEED · REAL Palmistry Engine
   True Palmistry Report · V100
   ========================================================== */

export function generateTrueReport({ user, palm, lines }) {

    return `
🕉️ THE SEED · Real Palmistry AI · V100

👤 User:
• Name: ${user.name}
• Gender: ${user.gender}
• DOB: ${user.dob}
• Country: ${user.country}
• Hand Scanned: ${user.hand}

-----------------------------------
📌 TRUE PALM LINE STRENGTH (0–1)
-----------------------------------
Life Line      : ${lines.life.toFixed(3)}
Head Line      : ${lines.head.toFixed(3)}
Heart Line     : ${lines.heart.toFixed(3)}
Fate Line      : ${lines.fate.toFixed(3)}
Sun Line       : ${lines.sun.toFixed(3)}
Mercury Line   : ${lines.mercury.toFixed(3)}
Marriage Line  : ${lines.marriage.toFixed(3)}
Health Line    : ${lines.health.toFixed(3)}

-----------------------------------
🔮 AI INTERPRETATION
-----------------------------------

• Life Line → Shows physical vitality & recovery pattern.
• Head Line → Reflects decision clarity & analytical skill.
• Heart Line → Emotional stability & bonding pattern.
• Fate Line → Long-term destiny & career stability.
• Sun Line → Talent visibility & future recognition.
• Mercury Line → Communication & intelligence pathways.
• Marriage Line → Relationship depth & trust style.
• Health Line → Stress resistance & body-energy system.

-----------------------------------
🌿 Palm Signature
• Image Threshold: ${palm.threshold.toFixed(2)}
• Size: ${palm.width} × ${palm.height}

(Real signal → No demo, No randomness)
`;
}
