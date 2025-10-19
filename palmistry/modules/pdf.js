// modules/pdf.js
// If you already load jspdf from CDN elsewhere, keep it. If not, dynamic import:
export async function exportPDF({ imageDataURL, lines, meta }){
  if (!window.jspdf) {
    await new Promise((ok,err)=>{
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js';
      s.onload = ok; s.onerror = err; document.head.appendChild(s);
    });
  }
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({ unit:'pt', format:'a4' });
  const W = 595, H = 842;

  // Title
  pdf.setFontSize(14);
  pdf.text('Sathyadarshana · Quantum Palm Report', 40, 40);
  pdf.setFontSize(10);
  pdf.text(`Hand: ${meta.hand}  Mirror:${meta.mirror}  Time:${meta.when}`, 40, 58);

  // Image
  const imgW = W-80, imgH = imgW * 0.56; // approx 16:9
  pdf.addImage(imageDataURL, 'JPEG', 40, 80, imgW, imgH);

  // Legend
  const colors = {
    life:'#00e5ff', fate:'#16f0a7', head:'#ffd166', heart:'#ff6b6b',
    sun:'#fca311', health:'#9d4edd', marriage:'#ff4d8d', manikanda:'#7df9ff'
  };
  let y = 80+imgH+24;
  pdf.text('Lines:', 40, y); y+=14;
  Object.entries(colors).forEach(([k,c])=>{
    pdf.setDrawColor(c); pdf.setFillColor(c);
    pdf.rect(40, y-8, 8, 8, 'F');
    pdf.setTextColor(0); pdf.text(k, 56, y);
    y+=14;
  });

  pdf.save('Palmistry_Report.pdf');
}
