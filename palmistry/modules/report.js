import { translateTextAI } from "./translate.js";
import { speak } from "./voice.js";

export async function generateReport(result, lang="en") {
  const { jsPDF } = window.jspdf;

  // Dynamic translation
  const title   = await translateTextAI("Palmistry AI Report", lang);
  const life    = await translateTextAI("Life Line:", lang);
  const head    = await translateTextAI("Head Line:", lang);
  const heart   = await translateTextAI("Heart Line:", lang);
  const fate    = await translateTextAI("Fate Line:", lang);
  const summaryT= await translateTextAI("Summary:", lang);
  const summary = await translateTextAI(result.summary, lang);

  // PDF
  const doc = new jsPDF();
  doc.setFont("helvetica","bold");
  doc.text(title, 10, 15);
  doc.setFont("helvetica","normal");
  doc.text(`${life} ${result.life_line}`, 10, 30);
  doc.text(`${head} ${result.head_line}`, 10, 40);
  doc.text(`${heart} ${result.heart_line}`, 10, 50);
  doc.text(`${fate} ${result.fate_line}`, 10, 60);
  doc.text(summaryT, 10, 75);
  doc.text(summary, 10, 85, { maxWidth: 180 });
  doc.save(`PalmReport_${lang}.pdf`);

  // Speak same translation
  speak(summary, lang);
}
