import { speak } from "./voice.js";

window.exportPalmPDF = async function (side) {
  const { jsPDF } = window.jspdf;
  const box = document.querySelector(`#report-${side}`);
  const lang = window.currentLang || "en";
  const img = window.capturedHands[side] || null;

  let text = box.innerText.replace("📜 Save PDF", "");

  const translated = await window.translateText(text, lang);
  const pdf = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });

  // 🖐️ add captured hand image if available
  if (img) {
    const imgWidth = 80, imgHeight = 60;
    pdf.addImage(img, "PNG", 65, 15, imgWidth, imgHeight);
    pdf.text("Captured Hand Image", 75, 80);
  }

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(12);
  pdf.text(translated, 15, 100, { maxWidth: 180 });

  // watermark
  pdf.setTextColor(150);
  pdf.setFontSize(10);
  pdf.text("© Sathyadarshana · Light of Truth", 60, 285);

  pdf.save(`PalmReport_${side}_${lang}.pdf`);
};
