// modules/pdf.js
// Make sure to add jsPDF to your project (npm: 'jspdf', or CDN: https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js)

export const LANGUAGES = {
  en: "English", si: "Sinhala", ta: "Tamil", fr: "French", de: "German",
  es: "Spanish", "zh-cn": "Chinese (Simplified)", hi: "Hindi", ar: "Arabic",
  ja: "Japanese", ru: "Russian", pt: "Portuguese", ko: "Korean",
  it: "Italian", tr: "Turkish", id: "Indonesian", nl: "Dutch", sv: "Swedish"
};

export function exportPalmPDF({ leftCanvas, rightCanvas, leftReport, rightReport, mode = 'mini' }) {
  // Use jsPDF as global or imported
  const pdf = window.jspdf ? new window.jspdf.jsPDF("p", "pt", "a4") : new window.jsPDF("p", "pt", "a4");

  const leftImg = leftCanvas.toDataURL("image/png");
  const rightImg = rightCanvas.toDataURL("image/png");

  // Header
  pdf.setFontSize(20);
  pdf.text("Sathya Darshana Palm Analyzer Report", 40, 40);
  pdf.setFontSize(11);
  pdf.text("email: sathyadarshana2025@gmail.com", 40, 60);
  pdf.text("phone: +94757500000", 40, 75);
  pdf.text("Sri Lanka", 40, 90);

  pdf.setFontSize(16);
  pdf.text("Left Hand", 60, 130);
  pdf.text("Right Hand", 320, 130);

  pdf.addImage(leftImg, "PNG", 40, 145, 200, 260);
  pdf.addImage(rightImg, "PNG", 310, 145, 200, 260);

  pdf.setFontSize(12);
  let y = 420;
  if (mode === 'mini') {
    // Mini report: Key lines and summary under each image
    pdf.text(leftReport.summary, 40, y);
    y += 16;
    leftReport.lines.slice(0, 3).forEach((line, i) => {
      pdf.text(`${line.name}: ${line.insight} (${(line.confidence*100).toFixed(1)}%)`, 40, y + i*14);
    });
    y += 50;
    pdf.text(rightReport.summary, 310, y);
    y += 16;
    rightReport.lines.slice(0, 3).forEach((line, i) => {
      pdf.text(`${line.name}: ${line.insight} (${(line.confidence*100).toFixed(1)}%)`, 310, y + i*14);
    });
  } else {
    // Full multi-page report
    pdf.addPage();
    pdf.setFontSize(18);
    pdf.text("Left Hand - Detailed Palm Line Analysis", 40, 40);
    pdf.addImage(leftImg, "PNG", 40, 60, 160, 210);
    pdf.setFontSize(13);
    let yPos = 290;
    pdf.text(leftReport.summary, 40, yPos); yPos += 18;
    leftReport.lines.forEach((line, i) => {
      pdf.text(`${line.name}: ${line.insight} (${(line.confidence*100).toFixed(1)}%)`, 40, yPos);
      yPos += 18;
      if (line.details) { pdf.text(line.details, 60, yPos); yPos += 14; }
    });

    pdf.addPage();
    pdf.setFontSize(18);
    pdf.text("Right Hand - Detailed Palm Line Analysis", 40, 40);
    pdf.addImage(rightImg, "PNG", 40, 60, 160, 210);
    pdf.setFontSize(13);
    yPos = 290;
    pdf.text(rightReport.summary, 40, yPos); yPos += 18;
    rightReport.lines.forEach((line, i) => {
      pdf.text(`${line.name}: ${line.insight} (${(line.confidence*100).toFixed(1)}%)`, 40, yPos);
      yPos += 18;
      if (line.details) { pdf.text(line.details, 60, yPos); yPos += 14; }
    });
  }

  pdf.save("SathyaDarshana_Palm_Report.pdf");
}
