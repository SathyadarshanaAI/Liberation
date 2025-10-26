import { translateTextAI } from "./translate.js";
import { speak } from "./voice.js";

export async function generateReport(result, lang="en") {
  const summary = await translateTextAI(result.summary, lang);
  const title = await translateTextAI("Palmistry AI Report", lang);

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFont("helvetica","bold");
  doc.text(title, 10, 15);
  doc.setFont("helvetica","normal");
  doc.text(await translateTextAI("Life Line: ", lang) + result.life_line, 10, 30);
  doc.text(await translateTextAI("Head Line: ", lang) + result.head_line, 10, 40);
  doc.text(await translateTextAI("Heart Line: ", lang) + result.heart_line, 10, 50);
  doc.text(await translateTextAI("Fate Line: ", lang) + result.fate_line, 10, 60);
  doc.text(await translateTextAI("Summary:", lang), 10, 75);
  doc.text(summary, 10, 85, { maxWidth: 180 });
  doc.save(`PalmReport_${lang}.pdf`);

  speak(summary, lang);
}
