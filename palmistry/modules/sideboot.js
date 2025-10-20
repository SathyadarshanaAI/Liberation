// modules/sideboot.js
// No-conflict side boot panel (works without touching index/app.js)

import { openCamera, stopCamera, startLoop, captureToCanvas } from './camera.js';

// annotator / ui overlay (support either file name / export)
import * as Annot from './annotator.js';
// If you really have a ui.js later, this optional import can be added too:
// import * as UI from './ui.js';

import * as Analyzer from './analyzer.js';
import * as PDF from './pdf.js';

// ---- safe aliases (won't crash if a symbol is missing) ----
const drawOverlay =
  Annot.drawOverlayDemo || Annot.drawOverlay || ((cv, lines) => { /* no-op */ });

const analyzeFrame =
  Analyzer.analyzeMock || Analyzer.analyze || (async () => ({}));

const exportPdf =
  PDF.exportPDF || PDF.exportPalmPDF || (async () => { console.warn('[sideboot] PDF export fallback'); });

// -----------------------------------------------------------

export async function boot() {
  ensurePanel();

  const cL = document.getElementById('canvasLeft')  || ensureCanvas('canvasLeft');
  const cR = document.getElementById('canvasRight') || ensureCanvas('canvasRight');

  const state = { stream: null, loopStop: null, mirrorRight: true, running: false };

  async function startAll() {
    if (state.running) return;
    state.stream = await openCamera({ facingMode: 'environment', width: 1920, height: 1080 });
    state.loopStop = startLoop({
      stream: state.stream,
      canvasLeft: cL,
      canvasRight: cR,
      mirrorRight: () => state.mirrorRight
    });
    state.running = true;
    log('▶️ Camera started');
  }

  function stopAll() {
    try { state.loopStop && state.loopStop(); } catch {}
    stopCamera(state.stream);
    state.running = false;
    log('🛑 Camera stopped');
  }

  function captureRight() {
    if (!state.running) return;
    captureToCanvas(cR, { sourceStream: state.stream, mirror: state.mirrorRight });
    log(`📸 Captured (mirror=${state.mirrorRight})`);
  }

  async function overlay() {
    const lines = await analyzeFrame(cR);
    drawOverlay(cR, lines);
    log('🎨 Overlay drawn');
  }

  async function makePDF() {
    const lines = await analyzeFrame(cR);
    await exportPdf({
      imageDataURL: cR.toDataURL('image/jpeg', 0.92),
      lines,
      meta: { hand: 'Right', mirror: state.mirrorRight, when: new Date().toISOString() }
    });
    log('📄 PDF downloaded');
  }

  bind('sbStart',  startAll);
  bind('sbStop',   stopAll);
  bind('sbCap',    captureRight);
  bind('sbMirror', () => { state.mirrorRight = !state.mirrorRight; log(`↔️ Mirror: ${state.mirrorRight}`); });
  bind('sbOverlay', overlay);
  bind('sbPDF',     makePDF);
  bind('sbHide',    () => document.getElementById('sideboot-wrap')?.remove());

  window.addEventListener('keydown', (e) => {
    const k = e.key.toLowerCase();
    if (k === 's') startAll();
    else if (k === 'x') stopAll();
    else if (k === 'c') captureRight();
    else if (k === 'm') state.mirrorRight = !state.mirrorRight;
    else if (k === 'o') overlay();
    else if (k === 'p') makePDF();
  });

  log('SideBoot ready. Hotkeys: S,X,C,M,O,P');
}

function bind(id, fn) {
  const el = document.getElementById(id);
  if (el) el.onclick = fn;
}

function ensureCanvas(id) {
  const cv = document.createElement('canvas');
  cv.id = id;
  cv.width = 1280;
  cv.height = 720;
  cv.style.cssText = 'width:100%;max-height:38vh;border:2px solid #134;border-radius:10px;background:#000;margin-top:6px';
  document.getElementById('sideboot-wrap').querySelector('.cwrap').appendChild(cv);
  return cv;
}

function ensurePanel() {
  if (document.getElementById('sideboot-wrap')) return;
  const wrap = document.createElement('div');
  wrap.id = 'sideboot-wrap';
  wrap.style.cssText = 'position:fixed;inset:auto 10px 10px 10px;z-index:9999;max-width:640px';
  wrap.innerHTML = `
    <div style="background:#0b0f16cc;border:1px solid #123;border-radius:12px;padding:10px;color:#cfe">
      <b style="color:#0ff">SideBoot Panel</b>
      <div class="cwrap" style="display:grid;gap:8px;margin-top:8px"></div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
        <button id="sbStart">Start</button>
        <button id="sbStop">Stop</button>
        <button id="sbCap">Capture → Right</button>
        <button id="sbMirror">Mirror</button>
        <button id="sbOverlay">Overlay</button>
        <button id="sbPDF">PDF</button>
        <button id="sbHide">Hide</button>
      </div>
    </div>`;
  document.body.appendChild(wrap);
}

function log(s) { console.log('[SideBoot]', s); }
