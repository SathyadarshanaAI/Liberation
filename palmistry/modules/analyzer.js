window.addEventListener('DOMContentLoaded', () => {
  camLeft  = new CameraCard(camBoxLeft,  { facingMode: 'environment', onStatus: setStatus });
  camRight = new CameraCard(camBoxRight, { facingMode: 'environment', onStatus: setStatus });

  // initial canvas size (prevents zero-size analyze)
  fitCanvas(camBoxLeft,  canvasLeft,  false);
  fitCanvas(camBoxRight, canvasRight, false);
  new ResizeObserver(()=>fitCanvas(camBoxLeft,  canvasLeft,  lockedL)).observe(camBoxLeft);
  new ResizeObserver(()=>fitCanvas(camBoxRight, canvasRight, lockedR)).observe(camBoxRight);

  // LEFT controls
  document.getElementById("startCamLeft").onclick = async () => {
    unlockCanvas(camBoxLeft, canvasLeft, 'L');
    await camLeft.start();
    setStatus("Left hand camera started.");
  };
  document.getElementById("captureLeft").onclick = () => {
    if (camLeft.captureTo(canvasLeft)) { lockCanvas('L'); setStatus("Left hand captured."); }
  };
  document.getElementById("uploadLeft").onclick = () => fileUpload(camBoxLeft, canvasLeft, 'L');
  document.getElementById("torchLeft").onclick  = () => camLeft.toggleTorch();

  // RIGHT controls
  document.getElementById("startCamRight").onclick = async () => {
    unlockCanvas(camBoxRight, canvasRight, 'R');
    await camRight.start();
    setStatus("Right hand camera started.");
  };
  document.getElementById("captureRight").onclick = () => {
    if (camRight.captureTo(canvasRight)) { lockCanvas('R'); setStatus("Right hand captured."); }
  };
  document.getElementById("uploadRight").onclick = () => fileUpload(camBoxRight, canvasRight, 'R');
  document.getElementById("torchRight").onclick  = () => camRight.toggleTorch();

  // ANALYZE (→ uses moduler.js)
  document.getElementById("analyze").onclick = async () => {
    if (!canvasLeft.width  || !canvasLeft.height)  return setStatus("Left hand: Capture or Upload first.");
    if (!canvasRight.width || !canvasRight.height) return setStatus("Right hand: Capture or Upload first.");

    setStatus("Analyzing palms...");
    try {
      await animateScan(canvasLeft);
      await animateScan(canvasRight);

      // call your analyze module
      lastAnalysisLeft  = await analyzeHand(canvasLeft,  'left');
      lastAnalysisRight = await analyzeHand(canvasRight, 'right');

      insightEl.textContent = buildReport(lastAnalysisLeft, lastAnalysisRight, "full", lastLang);
      setStatus("Palm analysis complete!");
    } catch (e) {
      console.error(e);
      setStatus("Analyze failed. Check console.");
    }
  };

  // MINI REPORT
  document.getElementById("miniReport").onclick = () => {
    if (lastAnalysisLeft && lastAnalysisRight) {
      insightEl.textContent = buildReport(lastAnalysisLeft, lastAnalysisRight, "mini", lastLang);
    } else setStatus("Please capture/analyze both hands first.");
  };

  // PDF
  document.getElementById("fullReport").onclick = () => {
    if (!(lastAnalysisLeft && lastAnalysisRight)) return setStatus("Please capture/analyze both hands first.");
    if (typeof exportPalmPDF === 'function') {
      exportPalmPDF({
        leftCanvas:  canvasLeft,
        rightCanvas: canvasRight,
        leftReport:  lastAnalysisLeft,
        rightReport: lastAnalysisRight,
        mode: "full"
      });
      setStatus("PDF report generated.");
    } else {
      setStatus("PDF module missing.");
    }
  };

  // SPEAK
  document.getElementById("speak").onclick = () => {
    if (!(lastAnalysisLeft && lastAnalysisRight)) return setStatus("Analyze both hands first!");
    const text = buildReport(lastAnalysisLeft, lastAnalysisRight, "full", lastLang);
    speakReport(text, lastLang);
  };

  // LANG
  langSel.onchange = () => { lastLang = langSel.value; };
});
