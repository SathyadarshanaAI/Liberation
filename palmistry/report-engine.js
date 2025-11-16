// =========================================================
// 🟣 THE SEED · Palmistry AI · V50
// REPORT GENERATOR — PURE ENGLISH
// Supports: short / standard / deep / unlimited
// =========================================================

export function generateReport(lines, energies, mode, user) {

    let targetLength = 500;

    if (mode === "standard") targetLength = 1200;
    if (mode === "deep") targetLength = 3500;
    if (mode === "unlimited") targetLength = 8000;

    return buildEnglishReport(lines, energies, user, targetLength);
}



// =========================================================
// BUILD PURE ENGLISH REPORT
// =========================================================
function buildEnglishReport(lines, energies, user, length) {

    let text = `
========================================================
THE SEED · PALMISTRY AI – FULL DESTINY REPORT
========================================================

USER INFORMATION
----------------
Full Name      : ${user.name || "Not provided"}
Gender         : ${user.gender || "Not provided"}
Date of Birth  : ${user.dob || "Not provided"}
Country        : ${user.country || "Not provided"}
Hand Scanned   : ${user.hand || "Not provided"}

Additional Note:
${user.note || "None"}

--------------------------------------------------------
This report is automatically generated using the 
THE SEED · V50 Hybrid Energy Engine, which analyzes 
your palm lines, chakra sectors, finger ratios, mounts, 
and energetic aura field to produce a deep personality, 
destiny, and life-path interpretation.
--------------------------------------------------------

PRIMARY ENERGY LEVELS (CHAKRA WHEEL)
------------------------------------
Spiritual Energy     : ${energies[0]}%
Mental Power         : ${energies[1]}%
Emotional Balance    : ${energies[2]}%
Physical Vitality    : ${energies[3]}%
Creativity           : ${energies[4]}%
Discipline/Stability : ${energies[5]}%
Social Harmony       : ${energies[6]}%
Destiny Path Strength: ${energies[7]}%

--------------------------------------------------------
DETAILED DESTINY REPORT
--------------------------------------------------------

`;

    // AUTO GENERATE UNTIL TARGET LENGTH IS REACHED
    while (text.length < length) {
        text += generateParagraph(lines, energies);
    }

    return text;
}



// =========================================================
// AI-STYLE PARAGRAPH GENERATOR (PURE ENGLISH)
// repeats until required length achieved
// =========================================================
function generateParagraph(lines, energies) {

    return `
Your palm reveals a dynamic interaction between mind, heart, and destiny. 
The Life Line, evaluated at ${lines.life}%, shows your adaptability and personal resilience. 
This suggests periods of physical vitality supported by strong emotional grounding. 
Your Head Line, scoring ${lines.head}%, indicates clarity of thought, problem-solving ability, 
and the tendency to analyze situations deeply before acting. It reflects a personality that 
prefers understanding over reacting, making your decisions thoughtful and deliberate.

Your Heart Line at ${lines.heart}% represents emotional intelligence. You feel deeply, 
observe emotional patterns in others, and possess natural empathy. This enhances your 
relationships, allowing you to understand others even when unspoken emotions are involved. 
Meanwhile, the Fate Line at ${lines.fate}% shows your long-term direction in life. This 
percentage reflects a sense of purpose, the presence of life lessons, and the confidence 
to follow the path you feel called towards.

Spiritually, with ${energies[0]}% energy, your aura displays intuitive strength and connection 
to inner wisdom. Mentally, your ${energies[1]}% suggests the mind is active, balanced, and 
able to handle both logic and creativity. Emotionally, a ${energies[2]}% level indicates 
periods of internal clarity mixed with subtle sensitivities that shape your personal journey.

Your destiny energy at ${energies[7]}% reflects strong alignment with your life path, 
indicating that your efforts will eventually manifest into long-lasting achievements. 
There is a powerful connection between your Sun Line and your potential for recognition, 
creativity, leadership, and meaningful contribution to the world.

`;
}
