// Lightweight PDF: open a print-friendly window and let user "Save as PDF"
// Works consistently on mobile/desktop without external libs.

export function exportPalmPDF({ leftCanvas, rightCanvas, leftReport, rightReport, mode='full' }) {
  const leftData = leftCanvas.toDataURL('image/jpeg', 0.92);
  const rightData = rightCanvas.toDataURL('image/jpeg', 0.92);

  const reportText = buildText(leftReport, rightReport, mode);

  const w = window.open('', '_blank');
  if (!w) { alert('Popup blocked. Please allow popups for this site.'); return; }
  w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"/>
  <title>Palm Report</title>
  <style>
    body{font-family:system-ui,Segoe UI,Arial;margin:24px;color:#111}
    h1{margin:0 0 12px 0}
    .grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
    img{width:100%;height:auto;border:1px solid #999;border-radius:8px}
    pre{white-space:pre-wrap;background:#f6f7fb;border:1px solid #ddd;border-radius:8px;padding:12px}
    .meta{margin-top:10px;font-size:.9rem;color:#333}
    @media print { body{color:#000} }
  </style>
  </head><body>
    <h1>Sathya Darshana Palm Report</h1>
    <div class="meta">Generated: ${new Date().toLocaleString()}</div>
    <div class="grid">
      <div><h3>Left Hand</h3><img src="${leftData}"/></div>
      <div><h3>Right Hand</h3><img src="${rightData}"/></div>
    </div>
    <h3>Analysis</h3>
    <pre>${escapeHtml(reportText)}</pre>
    <script>window.onload = ()=> setTimeout(()=>window.print(), 600);</script>
  </body></html>`);
  w.document.close();
}

function buildText(left, right, mode){
  let out = 'Sathya Darshana Palm Analyzer V5.1\n\n';
  out += `Left: ${left.summary}\nRight: ${right.summary}\n\n`;
  if (mode==='full'){
    out += 'Left details:\n';
    left.lines.forEach(l=> out += ` • ${l.name}: ${(l.confidence*100).toFixed(1)}% — ${l.insight}\n`);
    out += '\nRight details:\n';
    right.lines.forEach(l=> out += ` • ${l.name}: ${(l.confidence*100).toFixed(1)}% — ${l.insight}\n`);
  }
  out += '\nPalmistry is culturally interpretive.';
  return out;
}

function escapeHtml(s){
  return String(s)
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;');
}
