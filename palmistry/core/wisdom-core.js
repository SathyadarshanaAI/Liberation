// core/wisdom-core.js
// Lightweight WisdomCore: in-memory scans + simple "talk" and PDF placeholder

export const WisdomCore = (function () {
  const scans = [];

  function saveScan(scan) {
    scans.push(scan);
    console.log("[WisdomCore] saved scan:", scan.timestamp || Date.now());
  }

  function getLastScan() {
    if (scans.length === 0) return null;
    return scans[scans.length - 1];
  }

  async function talk(scan) {
    // Very simple conversational reply based on lines count
    if (!scan) return "No scan data available.";
    const lines = scan.lines || [];
    const n = lines.length;
    return `I see ${n} main lines. The Life, Head and Heart lines are present. Ask about a specific line (Life/Head/Heart) and I will describe it.`;
  }

  function exportPDF() {
    // Placeholder: returns a data URL of a simple canvas A4-looking image
    const canvas = document.createElement("canvas");
    // A4-like proportions at 96dpi: 1123 x 794 (landscape) — we'll use portrait
    canvas.width = 794;
    canvas.height = 1123;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#00eaff";
    ctx.font = "20px Arial";
    ctx.fillText("THE SEED · Palmistry AI — A4 Export (placeholder)", 20, 40);
    // return data URL
    return canvas.toDataURL("image/png");
  }

  return {
    saveScan,
    getLastScan,
    talk,
    exportPDF
  };
})();
