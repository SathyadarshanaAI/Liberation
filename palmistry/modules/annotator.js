// modules/annotator.js
// Overlay a transparent layer on top of your target canvas to tag events.
// Produces normalized annotations: pos in [0..1] along X/Y and optional line key.

const DEFAULTS = {
  targetCanvasId: 'canvasRight',
  lines: ['heart','head','life','fate','sun','health','marriage','manikanda']
};

let state = null;

export function mountAnnotator(opts = {}) {
  const cfg = { ...DEFAULTS, ...opts };
  const base = document.getElementById(cfg.targetCanvasId) || document.querySelector('canvas');
  if (!base) throw new Error('Annotator: target canvas not found');

  // container
  const box = document.createElement('div');
  Object.assign(box.style, {
    position:'absolute', inset:'0', pointerEvents:'none'
  });

  // overlay canvas
  const overlay = document.createElement('canvas');
  overlay.width = base.width; overlay.height = base.height;
  Object.assign(overlay.style, {
    position:'absolute', left: base.offsetLeft+'px', top: base.offsetTop+'px',
    width: base.clientWidth+'px', height: base.clientHeight+'px',
    pointerEvents:'auto', cursor:'crosshair'
  });

  // toolbar
  const ui = document.createElement('div');
  ui.innerHTML = `
    <style>
      .annbar{position:fixed;left:18px;bottom:110px;z-index:9999;background:#0c121cde;color:#dff;
        border:1px solid #1e2b3a;border-radius:12px;padding:8px 10px;font:13px system-ui}
      .annbar select, .annbar button{background:#0f1b2a;color:#dff;border:1px solid #1e2b3a;border-radius:8px;padding:6px 10px;margin-right:6px}
      .annbar .dot{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:6px;background:#7de8ff}
    </style>
    <div class="annbar">
      <span class="dot"></span><b>Annotate</b>
      <select id="ann-type">
        <option value="fork">fork</option>
        <option value="cross">cross</option>
        <option value="break">break</option>
      </select>
      <select id="ann-line">${cfg.lines.map(l=>`<option>${l}</option>`).join('')}</select>
      <button id="ann-undo">Undo</button>
      <button id="ann-clear">Clear</button>
      <button id="ann-exit">Exit</button>
    </div>
  `;

  base.parentElement.style.position = 'relative';
  base.parentElement.appendChild(box);
  box.appendChild(overlay);
  document.body.appendChild(ui);

  const ctx = overlay.getContext('2d');
  const ann = []; // {type,line,xn,yn,ts}

  function drawAll() {
    ctx.clearRect(0,0,overlay.width, overlay.height);
    for (const a of ann) drawMark(a);
  }
  function drawMark(a) {
    const x = a.xn * overlay.width, y = a.yn * overlay.height;
    ctx.lineWidth = 2; ctx.strokeStyle = a.type==='fork'?'#16f0a7':a.type==='cross'?'#ff6b6b':'#ffd166';
    ctx.fillStyle = ctx.strokeStyle;
    ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.moveTo(x-10,y); ctx.lineTo(x+10,y); ctx.moveTo(x,y-10); ctx.lineTo(x,y+10); ctx.stroke();
    ctx.font = '12px ui-monospace'; ctx.fillStyle = '#cfe';
    ctx.fillText(`${a.type}:${a.line}`, x+8, y-8);
  }

  function clientToNorm(ev) {
    const r = overlay.getBoundingClientRect();
    const xn = (ev.clientX - r.left) / r.width;
    const yn = (ev.clientY - r.top) / r.height;
    return { xn: clamp(xn,0,1), yn: clamp(yn,0,1) };
  }

  overlay.addEventListener('click', (ev) => {
    const { xn, yn } = clientToNorm(ev);
    const type = document.getElementById('ann-type').value;
    const line = document.getElementById('ann-line').value;
    ann.push({ type, line, xn, yn, ts: Date.now() });
    drawAll();
    document.dispatchEvent(new CustomEvent('annotator:add', { detail: { type, line, xn, yn } }));
  });

  ui.querySelector('#ann-undo').onclick = ()=>{ ann.pop(); drawAll(); };
  ui.querySelector('#ann-clear').onclick = ()=>{ ann.length=0; drawAll(); };
  ui.querySelector('#ann-exit').onclick  = ()=>{ destroy(); };

  // keep track for teardown & export
  state = { base, overlay, ui, ann, cfg, drawAll, destroy };

  function destroy() {
    overlay.remove(); ui.remove();
    state = null;
    document.dispatchEvent(new CustomEvent('annotator:exit'));
  }

  drawAll();
  return { getAnnotations: () => ann.slice(), destroy };
}

export function annotationsToStructures(ann = []) {
  // Convert point tags into line-structure additions grouped by line
  const out = {};
  for (const a of ann) {
    if (!out[a.line]) out[a.line] = {};
    const L = out[a.line];
    if (a.type === 'fork')   (L.forks   ||= []).push({ pos: guessAlongLine(a), to: guessMount(a) });
    if (a.type === 'cross')  (L.crosses ||= []).push({ pos: guessAlongLine(a), mount: guessMount(a) });
    if (a.type === 'break')  (L.breaks  ||= []).push(guessAlongLine(a));
  }
  return out;
}

// Heuristics — improve once you have polylines & mount maps
function guessAlongLine(a){ return a.xn; }            // naive: x-projection
function guessMount(a){
  const x=a.xn, y=a.yn;
  // rough areas: top-right=mercury, top=jupiter/saturn/apollo band
  if (x>0.75 && y<0.35) return 'mercury';
  if (x>0.66) return 'apollo';
  if (x>0.33 && x<0.66) return 'saturn';
  return 'jupiter';
}

function clamp(x,a,b){ return Math.max(a, Math.min(b, x)); }
