export function exportPalmPDF({ leftCanvas, rightCanvas, leftReport, rightReport, mode = 'mini' }) {
  // Use jsPDF as global from CDN
  const pdf = window.jspdf ? new window.jspdf.jsPDF("p", "pt", "a4") : new window.jsPDF("p", "pt", "a4");
  const leftImg = leftCanvas.toDataURL("image/png");
  const rightImg = rightCanvas.toDataURL("image/png");

  pdf.setFontSize(18);
  pdf.text("Sathya Darshana Palm Analyzer Report", 40, 40);
  pdf.setFontSize(11);
  pdf.text("email: sathyadarshana2025@gmail.com", 40, 60);
  pdf.text("phone: +94757500000", 40, 75);
  pdf.text("Sri Lanka", 40, 90);

  pdf.text("Left Hand", 60, 130);
  pdf.text("Right Hand", 320, 130);

  pdf.addImage(leftImg, "PNG", 40, 145, 200, 260);
  pdf.addImage(rightImg, "PNG", 310, 145, 200, 260);

  pdf.setFontSize(12);
  let y = 420;
  pdf.text(leftReport.summary, 40, y);
  pdf.text(rightReport.summary, 310, y);

  // Optionally, add details (for full report)
  if (mode === 'full') {
    pdf.addPage();
    pdf.setFontSize(16);
    pdf.text("Left Hand Details", 40, 40);
    let yLeft = 70;
    leftReport.lines.forEach(line => {
      pdf.text(`${line.name}: ${line.insight} (${(line.confidence*100).toFixed(1)}%)`, 40, yLeft);
      yLeft += 18;
      if (line.details) {
        pdf.text(line.details, 60, yLeft);
        yLeft += 14;
      }
    });

    pdf.addPage();
    pdf.setFontSize(16);
    pdf.text("Right Hand Details", 40, 40);
    let yRight = 70;
    rightReport.lines.forEach(line => {
      pdf.text(`${line.name}: ${line.insight} (${(line.confidence*100).toFixed(1)}%)`, 40, yRight);
      yRight += 18;
      if (line.details) {
        pdf.text(line.details, 60, yRight);
        yRight += 14;
      }
    });
  }

  pdf.save("SathyaDarshana_Palm_Report.pdf");
}
