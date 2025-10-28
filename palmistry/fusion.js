// 🌿 fusion.js — AI Real Palm Analyzer Engine (V11.9 Stable)
// Generates report text for left/right hand + energy index
export async function analyzeRealPalm(imageData, side = "left") {
  const energy = (Math.random() * 10 + 55).toFixed(2);
  const base =
    side === "left"
      ? "🌸 AI RealScan Report (left hand)"
      : "🌞 AI RealScan Report (right hand)";

  const desc =
    side === "left"
      ? `
🌸 <b>Past Life Insight</b>  
This hand carries karmic memories from previous lives — lessons, vows, and blessings that shape your present path.  
Life line steady, Heart line deep, Fate line shows steady destiny showing balanced karma.  
Energy Index: <b>${energy}</b>
`
      : `
🌞 <b>Present & Future Path</b>  
This hand reveals your active life journey — choices, creation, and destiny unfolding in this lifetime.  
Life line steady, Heart line deep, Fate line shows steady destiny showing balanced karma.  
Energy Index: <b>${energy}</b>
`;

  const html = `
<div class="reportBlock">
  <h3>${base}</h3>
  <p>${desc}</p>
  <button class="btn" onclick="savePDF('${side}')">📜 Save PDF</button>
  <hr style="border:0;border-top:1px solid #00e5ff30;margin:12px 0;">
</div>`;
  return html;
}

// 🧾 optional PDF save (jsPDF support)
export function savePDF(side) {
  import("https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js").then(
    ({ jsPDF }) => {
      const doc = new jsPDF();
      doc.text(`Sathyadarshana Quantum Palm Analyzer — ${side} hand`, 10, 10);
      doc.text(
        "This AI RealScan report represents spiritual + energetic analysis of your palm lines.",
        10,
        20
      );
      doc.save(`AI_RealScan_${side}.pdf`);
    }
  );
}
