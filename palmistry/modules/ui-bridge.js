// modules/ui-bridge.js
// Lightweight UI bridge + event bus for Palmistry modules.
// Works even if some elements are missing. No hard coupling to app.js.

//// ─────────────── Event Bus ───────────────
const bus = new Map(); // name -> Set<fn>

export function on(name, fn) {
  if (!bus.has(name)) bus.set(name, new Set());
  bus.get(name).add(fn);
  return () => off(name, fn);        // unsubscribe handle
}
export function once(name, fn) {
  const offFn = on(name, (...a) => { offFn(); fn(...a); });
  return offFn;
}
export function off(name, fn) {
  const set = bus.get(name);
  if (set) { set.delete(fn); if (!set.size) bus.delete(name); }
}
export function emit(name, payload) {
  const set = bus.get(name);
  if (set) for (const fn of set) try { fn(payload); } catch(e){ console.error(e); }
}

// Small throttle to avoid double fires on fast taps
function throttle(fn, ms=200) {
  let t=0; return (...a)=>{ const now=Date.now(); if (now-t>=ms){ t=now; fn(...a); } };
}

//// ─────────────── DOM helpers ───────────────
const $  = (id) => document.getElementById(id);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

function bind(id, eventName) {
  const el = $(id);
  if (!el) return;
  el.addEventListener('click', throttle(()=>emit(eventName)));
}

export function init() {
  // Wire buttons (only if present). Safe to call multiple times.
  bind('startCam',    'startCamera');
  bind('switchBtn',   'switchCam');
  bind('flashBtn',    'flash');
  bind('capture',     'capture');
  bind('analyze',     'analyze');
  bind('pdfBtn',      'pdf');
  bind('summaryBtn',  'pairSummary');

  // Keyboard hotkeys (optional, non-intrusive)
  window.addEventListener('keydown', (e) => {
    const k = e.key.toLowerCase();
    if (k === 's') emit('startCamera');
    else if (k === 'x') emit('stopCamera');
    else if (k === 'c') emit('capture');
    else if (k === 'o') emit('analyze');
    else if (k === 'p') emit('pdf');
    else if (k === 'm') emit('switchCam'); // or mirror toggle
  }, { passive: true });

  // Touch double-tap on right canvas shows summary if available
  const r = $('canvasRight') || $('canvas') || null;
  if (r) {
    let last = 0;
    r.addEventListener('touchend', () => {
      const now = Date.now();
      if (now - last < 300) emit('pairSummary');
      last = now;
    }, { passive: true });
  }
}

//// ─────────────── Canvas helpers ───────────────
function getCanvas() {
  // Prefer a specific canvas id if you have two
  return $('canvas') || $('canvasRight') || $('canvasLeft') || $$('canvas')[0] || null;
}

export function draw(canvas) {
  // camera pipeline should have drawn already; we only update UI bits
  const s = $('status');
  if (s) s.textContent = 'Frame captured';
}

export function getImageData() {
  const c = getCanvas();
  if (!c) throw new Error('No canvas found');
  const g = c.getContext('2d', { willReadFrequently: true });
  const dpr = window.devicePixelRatio || 1;
  // Ensure backing store matches CSS size
  if (!c.width || !c.height) {
    c.width  = Math.round(c.clientWidth  * dpr) || 1280;
    c.height = Math.round(c.clientHeight * dpr) || 720;
  }
  return g.getImageData(0, 0, c.width, c.height);
}

export function getThumb({ type='image/jpeg', quality=0.85, maxW=640 } = {}) {
  const c = getCanvas();
  if (!c) throw new Error('No canvas found');

  // Create downscaled thumbnail to keep storage light
  const scale = Math.min(1, maxW / (c.width || 1));
  if (scale < 1) {
    const t = document.createElement('canvas');
    t.width = Math.round(c.width * scale);
    t.height = Math.round(c.height * scale);
    t.getContext('2d').drawImage(c, 0, 0, t.width, t.height);
    return t.toDataURL(type, quality);
  }
  return c.toDataURL(type, quality);
}

//// ─────────────── Overlay & Scores ───────────────
export function renderScores(result) {
  if (!result || !result.lines) return;

  // Expected order: heart, mind(head), life, fate, success(sun), health, marriage
  const vals = [
    result.lines.heart,
    result.lines.mind ?? result.lines.head,
    result.lines.life,
    result.lines.fate,
    result.lines.success ?? result.lines.sun,
    result.lines.health,
    result.lines.marriage
  ].map(v => Number(v ?? 0));

  // Bar elements with ids b0..b6; missing bars are ignored safely
  vals.forEach((v, i) => {
    const el = document.getElementById('b' + i);
    if (!el) return;
    const clamped = Math.max(0, Math.min(100, v));
    el.style.transform = `scaleX(${clamped / 100})`;
    el.style.transformOrigin = '0 50%';
  });

  const conf = document.getElementById('conf');
  if (conf) conf.textContent = `Confidence ${Number(result.confidence ?? 0).toFixed(1)}%`;
}

//// ─────────────── Pair Summary ───────────────
export function renderPairSummary(group) {
  if (!group || !group.left || !group.right) {
    alert('Save both Left & Right first.');
    return;
  }
  const L = group.left, R = group.right;

  const imgL = $('sumLeft');  if (imgL)  imgL.src = L.thumb;
  const imgR = $('sumRight'); if (imgR)  imgR.src = R.thumb;

  // Optional text fields if present
  const tl = $('sumLeftMeta');  if (tl) tl.textContent  = L.meta || new Date(L.timestamp||Date.now()).toLocaleString();
  const tr = $('sumRightMeta'); if (tr) tr.textContent  = R.meta || new Date(R.timestamp||Date.now()).toLocaleString();

  // Show panel
  const panel = $('pairSummary');
  if (panel) panel.style.display = 'block';

  // Emit an event so other modules can hook (e.g., pdf export)
  emit('pairSummaryShown', group);
}

//// ─────────────── Convenience wiring (optional) ───────────────
export function wireDefaultHandlers(handlers = {}) {
  // Let app.js (or sideboot) pass handler fns; if not provided, we only emit.
  // Example:
  // wireDefaultHandlers({ startCamera: () => camera.start(), capture: () => camera.capture() })
  Object.entries(handlers).forEach(([name, fn]) => {
    if (typeof fn === 'function') on(name, fn);
  });
}

// Re-export bus in case someone needs manual control
export const Bus = { on, once, off, emit };
