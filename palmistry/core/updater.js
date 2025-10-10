// core/updater.js
const LOCAL_KEY = 'lab_manifest';
const REPO_MANIFEST_URL = `${location.origin}${location.pathname.replace(/\/[^\/]*$/, '/') }manifest.json`;

export async function loadManifest({force=false}={}) {
  try {
    const cached = JSON.parse(localStorage.getItem(LOCAL_KEY) || 'null');
    if (cached && !force) return cached;

    const res = await fetch(REPO_MANIFEST_URL, {cache:'no-store'});
    const manifest = await res.json();
    localStorage.setItem(LOCAL_KEY, JSON.stringify(manifest));
    return manifest;
  } catch (e) {
    console.warn('Manifest fetch failed, using cache', e);
    const cached = JSON.parse(localStorage.getItem(LOCAL_KEY) || 'null');
    if (cached) return cached;
    throw new Error('No manifest available');
  }
}

export function isNewer(remote, local) {
  const r = (remote||'0').split('.').map(Number);
  const l = (local ||'0').split('.').map(Number);
  for (let i=0;i<3;i++){ if((r[i]||0)>(l[i]||0))return true; if((r[i]||0)<(l[i]||0))return false; }
  return false;
}

export async function ensureUpdatedUI(uiHooks) {
  const manifest = await loadManifest();
  const current = window.LAB_VERSION || '0.0.0';
  if (isNewer(manifest.version, current)) {
    uiHooks?.toast?.(`Updating to v${manifest.version}…`);
    // Optional: verify module hashes here if needed.
    await caches?.keys?.().then(keys => Promise.all(keys.map(k=>caches.delete(k))).catch(()=>{}));
    // Hard reload to pull new assets/sw
    setTimeout(()=>location.reload(), 400);
    return;
  }
  return manifest;
}
