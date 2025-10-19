// modules/pdf.js — Auto-download PDF using jsPDF loaded in index.html
export function exportPalmPDF({ leftCanvas, rightCanvas, reportText, fileName = 'Palm_Report.pdf' }) {
  // Ensure jsPDF is available from the global UMD bundle
  const jsPDF = window.jspdf && window.jspdf.jsPDF;
  if (!jsPDF) {
    alert('PDF engine not loaded.');
    return;
  }

  const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 36;

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('Sathya Darshana Palm Report', M, M);

  // Images
  const maxImgW = W - M*2;
  const leftData  = leftCanvas.toDataURL('image/jpeg', 0.92);
  const rightData = rightCanvas.toDataURL('image/jpeg', 0.92);

  let y = M + 18;
  const addImage = (label, data, width, height) => {
    doc.setFont('helvetica','bold'); doc.setFontSize(12);
    y += 20; doc.text(label, M, y);
    const imgW = maxImgW, imgH = imgW * (height/width);
    if (y + imgH + 20 > H - M) { doc.addPage(); y = M; }
    doc.addImage(data, 'JPEG', M, y + 6, imgW, imgH, undefined, 'FAST');
    y += imgH + 6;
  };
  addImage('Left Hand',  leftData,  leftCanvas.width,  leftCanvas.height);
  addImage('Right Hand', rightData, rightCanvas.width, rightCanvas.height);

  // Text
  doc.setFont('helvetica','normal'); doc.setFontSize(11);
  const lines = doc.splitTextToSize(reportText, maxImgW);
  for (let i=0;i<lines.length;i++){
    if (y + 16 > H - M) { doc.addPage(); y = M; }
    y += 14; doc.text(lines[i], M, y);
  }

  // Save
  doc.save(fileName);
}
