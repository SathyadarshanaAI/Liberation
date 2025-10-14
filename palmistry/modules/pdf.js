export async function make(thumb, lastResult){
  if(!lastResult){ alert('Analyze first'); return; }
  await load('https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js');
  const sc = lastResult.lines;
  const block = document.createElement('div');
  block.style.padding='20px'; block.style.fontFamily='Inter,system-ui,Arial'; block.style.color='#111';
  block.innerHTML = `
    <h1 style="margin:0 0 8px;color:#09c;">Quantum Palm Analyzer – Full Report</h1>
    <div style="font-size:12px;color:#555;margin-bottom:10px">Version ${self.APP_VERSION||'4.6'} • ${new Date().toLocaleString()}</div>
    <img src="${thumb}" style="width:48%;border-radius:8px;border:1px solid #ddd"/>
    <h3>Line Scores</h3>
    <ul style="line-height:1.6">
      ${Object.entries(sc).map(([k,v])=>`<li>${k[0].toUpperCase()+k.slice(1)}: ${v}</li>`).join('')}
    </ul>
    <p>Confidence: ${lastResult.confidence}%</p>
    <p>Insight: Balanced progress profile with stable energy lines.</p>
    <hr/><small>Note: Symbolic reading for education & research — not medical advice.</small>`;
  html2pdf().set({ margin:10, filename:'QuantumPalmReport_v4.6.pdf',
    image:{type:'jpeg',quality:0.98}, html2canvas:{scale:2,useCORS:true},
    jsPDF:{unit:'mm',format:'a4',orientation:'portrait'} }).from(block).save();
}
function load(src){ return new Promise((res,rej)=>{ if(document.querySelector(`script[src="${src}"]`)) return res();
  const s=document.createElement('script'); s.src=src; s.onload=res; s.onerror=rej; document.body.appendChild(s); }); }
