export function exportPalmPDF({ leftCanvas, rightCanvas, leftReport, rightReport, mode='full', lang='en' }){
  const leftData = leftCanvas.toDataURL('image/jpeg', 0.92);
  const rightData = rightCanvas.toDataURL('image/jpeg', 0.92);
  const reportText = buildText(leftReport, rightReport, mode);

  const w = window.open('', '_blank');
  if (!w){ alert('Popup blocked. Please allow popups for this site.'); return; }
  const langs = 'en,si,ta,hi,bn,ar,es,fr,de,ru,ja,zh-CN';
  const html = `<!DOCTYPE html><html lang="${lang}"><head><meta charset="utf-8"/>
  <title>Palm Report</title>
  <style>
    body{font-family:system-ui,Segoe UI,Arial;margin:24px;color:#111}
    h1{margin:0 0 12px 0}
    .grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
    img{width:100%;height:auto;border:1px solid #999;border-radius:8px}
    pre{white-space:pre-wrap;background:#f6f7fb;border:1px solid #ddd;border-radius:8px;padding:12px}
    .meta{margin-top:10px;font-size:.9rem;color:#333}
    @media print { body{color:#000} }
    #google_translate_element{position:fixed;right:12px;top:12px}
  </style>
  </head><body>
    <div id="google_translate_element"></div>
    <h1>Sathya Darshana Palm Report</h1>
    <div class="meta">Generated: ${new Date().toLocaleString()}</div>
    <div class="grid">
      <div><h3>Left Hand</h3><img src="${leftData}"/></div>
      <div><h3>Right Hand</h3><img src="${rightData}"/></div>
    </div>
    <h3>Analysis</h3>
    <pre>${escapeHtml(reportText)}</pre>
    <script>
      // Pre-set googtrans cookie to force target language inside popup
      (function(){
        try {
          var pair = '/en/${lang}';
          var d = new Date(); d.setTime(d.getTime()+365*24*60*60*1000);
          var exp = ';expires='+d.toUTCString()+';path=/';
          document.cookie = 'googtrans='+pair+exp;
          document.cookie = 'googtrans='+pair+';domain='+location.hostname+exp;
        } catch(e){}
      })();
      function googleTranslateElementInit(){
        new google.translate.TranslateElement({pageLanguage:'en', includedLanguages:'${langs}'}, 'google_translate_element');
      }
    </script>
    <script src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
    <script>
      // Print after a short delay so translation can apply
      window.onload = function(){ setTimeout(function(){ window.print(); }, 900); };
    </script>
  </body></html>`;
  w.document.write(html);
  w.document.close();
}
