// palmistry/modules/sideboot.js
// No-conflict SIDE BOOTER — DOES NOT TOUCH app.js
// Usage (F12): import('./modules/sideboot.js').then(m=>m.boot())

// —— tiny DOM helpers
const $ = (id)=>document.getElementById(id);
const has = (id)=>!!$(id);

function ensureCanvases() {
  // expect #canvasLeft / #canvasRight; if missing, auto-create lightweight UI
  let cL = $('canvasLeft'), cR = $('canvasRight');
  let container = document.body;

  if (!cL || !cR) {
    const wrap = document.createElement('div');
    wrap.id = 'sideboot-wrap';
    wrap.style.cssText = 'position:fixed;inset:auto 10px 10px 10px;z-index:9999;pointer-events:auto;max-width:640px;';
    wrap.innerHTML = `
      <div style="background:#0b0f16cc;border:1px solid #123;border-radius:12px;padding:10px;color:#cfe">
        <b style="color:#0ff">SideBoot Panel</b>
        <div style="display:grid;gap:8px;margin-top:8px">
          <canvas id="canvasLeft" style="width:100%;max-height:38vh;border:2px solid #134;border-radius:10px;background:#000"></canvas>
          <canvas id="canvasRight" style="width:100%;max-height:38vh;border:2px solid #134;border-radius:10px;background:#000"></canvas>
        </div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
          <button id="sbStart">📷 Start</button>
          <button id="sbStop">🛑 Stop</button>
          <button id="sbCap">📸 Capture → Right</button>
          <button id="sbMirror">↔️ Mirror</button>
          <button id="sbOverlay">🎨 Overlay</button>
          <button id="sbPDF">📄 PDF</button>
          <button id="sbHide">🕳 Hide</button>
        </div>
        <small>Hotkeys: S start, X stop, C capture, M mirror, O overlay, P pdf</small>
      </div>`;
    container.appendChild(wrap);
  }

  // final refs
  cL = $('canvasLeft'); cR = $('canvasRight');
  if (!cL.width) { cL.width = 1280; cL.height = 720; }
  if (!cR.width) { cR.width = 1280; cR.height = 720; }
  return { cL, cR };
}

export async function boot() {
  // dynamic imports (no coupling to app.js)
  const [{ openCamera, stopCamera, startLoop, captureToCanvas },
         { drawOverlayDemo },
         { analyzeMock },
         { exportPDF }] = await Promise.all([
    import('./camera.js'),
    import('./ui.js'),
    import('./analyzer.js'),
    import('./pdf.js'),
  ]);

  const { cL, cR } = ensureCanvases();

  const state = {
    stream: null,
    loopStop: null,
    mirrorRight: true,
    running: false,
  };

  async function startAll(){
    if (state.running) return;
    state.stream = await openCamera({ facingMode:'environment', width:1920, height:1080 });
    state.loopStop = startLoop({
      stream: state.stream,
      canvasLeft: cL,
      canvasRight: cR,
      mirrorRight: ()=>state.mirrorRight
    });
    state.running = true;
    console.log('[SideBoot] ▶️ Camera started');
  }
  function stopAll(){
    try { state.loopStop && state.loopStop(); } catch {}
    stopCamera(state.stream);
    state.running = false;
    console.log('[SideBoot] 🛑 Camera stopped');
  }
  function captureRight(){
    if (!state.running) { console.warn('[SideBoot] Not running'); return; }
    captureToCanvas(cR, { sourceStream: state.stream, mirror: state.mirrorRight });
    console.log(`[SideBoot] 📸 Captured (mirror=${state.mirrorRight})`);
  }
  async function overlay(){
    const lines = await analyzeMock(cR); // mock AI
    drawOverlayDemo(cR, lines);
    console.log('[SideBoot] 🎨 Overlay drawn');
  }
  async function makePDF(){
    const dataURL = cR.toDataURL('image/jpeg', 0.92);
    await exportPDF({
      imageDataURL: dataURL,
      lines: await analyzeMock(cR),
      meta: { hand:'Right', mirror: state.mirrorRight, when: new Date().toISOString() }
    });
    console.log('[SideBoot] 📄 PDF downloaded');
  }

  // wire buttons if panel was injected
  const bind = (id, fn)=>{ const el=$(id); if(el) el.onclick = fn; };
  bind('sbStart', startAll);
  bind('sbStop',  stopAll);
  bind('sbCap',   captureRight);
  bind('sbMirror', ()=>{ state.mirrorRight = !state.mirrorRight; console.log('[SideBoot] Mirror:', state.mirrorRight); });
  bind('sbOverlay', overlay);
  bind('sbPDF', makePDF);
  bind('sbHide', ()=>{ const w=$('sideboot-wrap'); if(w) w.remove(); });

  // hotkeys (does not interfere with app.js)
  const onKey = (e)=>{
    const k = e.key.toLowerCase();
    if(k==='s') startAll();
    else if(k==='x') stopAll();
    else if(k==='c') captureRight();
    else if(k==='m') state.mirrorRight = !state.mirrorRight;
    else if(k==='o') overlay();
    else if(k==='p') makePDF();
  };
  window.addEventListener('keydown', onKey);

  // public uninstall
  window.SidePalm = {
    uninstall(){
      window.removeEventListener('keydown', onKey);
      stopAll();
      const w=$('sideboot-wrap'); if(w) w.remove();
      delete window.SidePalm;
      console.log('[SideBoot] ♻️ Uninstalled');
    }
  };

  console.log('[SideBoot] Ready. Use: S start, X stop, C capture, M mirror, O overlay, P pdf');
}
