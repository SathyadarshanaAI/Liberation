// modules/pdf.js  — popupless auto-PDF (no browser settings)
export async function exportPalmPDF({ leftCanvas, rightCanvas, reportText, fileName = 'Palm_Report.pdf' }) {
  // 1) Load jsPDF on demand (small, no build step)
  const { jsPDF } = await import('https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js');

  // 2) New doc
  const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 36;

  // 3) Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('Sathya Darshana Palm Report', M, M);

  // 4) Images (stacked)
  const maxImgW = W - M*2;
  const leftData = leftCanvas.toDataURL('image/jpeg', 0.92);
  const rightData = rightCanvas.toDataURL('image/jpeg', 0.92);

  let y = M + 18;
  const addImageBlock = (label, data) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(label, M, y += 20);
    const imgW = maxImgW, imgH = imgW * (leftCanvas.height/leftCanvas.width);
    if (y + imgH + 20 > H - M) { doc.addPage(); y = M; }
    doc.addImage(data, 'JPEG', M, y, imgW, imgH, undefined, 'FAST');
    y += imgH;
  };
  addImageBlock('Left Hand', leftData);
  addImageBlock('Right Hand', rightData);

  // 5) Analysis text (multi-page aware)
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  const lines = doc.splitTextToSize(reportText, maxImgW);
  for (let i = 0; i < lines.length; i++) {
    if (y + 16 > H - M) { doc.addPage(); y = M; }
    doc.text(lines[i], M, y += 14);
  }

  // 6) Save — no popups, direct download
  doc.save(fileName);
}
