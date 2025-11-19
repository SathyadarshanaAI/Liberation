/* ==============================================================
   REAL PALM REPORT · V200
   Generates full spiritual + personality analysis
   ============================================================== */

export function generateTrueReportV200(data) {

    const L = data.lines;

    function pct(v) {
        return (v*100).toFixed(1) + "%";
    }

return `
🔮 REAL Palm AI Report — THE SEED · V200

📌 Life Line: ${pct(L.life)}
📌 Head Line: ${pct(L.head)}
📌 Heart Line: ${pct(L.heart)}
📌 Fate Line: ${pct(L.fate)}
📌 Sun Line: ${pct(L.sun)}
📌 Mercury Line: ${pct(L.mercury)}
📌 Marriage Line: ${pct(L.marriage)}
📌 Health Line: ${pct(L.health)}

👤 User: ${data.user.name || "N/A"}
Gender: ${data.user.gender || "N/A"}
Country: ${data.user.country || "N/A"}

📄 Summary:
• Life Energy: ${L.life>0.55?"Strong":"Moderate"}
• Mind Clarity: ${L.head>0.5?"Sharp":"Balanced"}
• Emotional Depth: ${L.heart>0.5?"Deep":"Stable"}
• Destiny Direction: ${L.fate>0.45?"Focused":"Variable"}

(This is REAL Palm AI · V200 — Ridge + Line Detection)
`;
}
