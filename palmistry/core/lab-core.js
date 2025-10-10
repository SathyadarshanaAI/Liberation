// core/lab-core.js
import { ensureUpdatedUI, loadManifest } from './updater.js';

window.LAB_VERSION = '2.6.0'; // bump via CI
const toast = (m)=>{ const t=document.createElement('div'); t.textContent=m; t.style.cssText='position:fixed;left:50%;bottom:20px;transform:translateX(-50%);background:#00e5ff;color:#000;padding:8px 12px;border-radius:10px;font-weight:700;z-index:9999'; document.body.appendChild(t); setTimeout(()=>t.remove(),1800); };

(async function boot(){
  const manifest = await ensureUpdatedUI({toast}) || await loadManifest();
  // feature flags
  window.FLAGS = manifest.flags || {};
  // ROI presets override
  window.ROI = (manifest.roi_overrides && manifest.roi_overrides.default) || {};
  // dynamic import modules
  for (const m of manifest.modules) {
    await import(`../${m.path}?v=${manifest.version}`);
  }
  // plugins (optional)
  if (manifest.plugins && manifest.flags?.enable_plugins){
    for (const p of manifest.plugins) {
      if (p.enabled) await import(`../${p.path}?v=${manifest.version}`);
    }
  }
  toast(`Palmistry Lab ready (v${manifest.version})`);
})();
