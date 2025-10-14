// modules/updater.js
export class Updater {
  constructor({ versionUrl, featuresUrl, currentVersion }) {
    this.versionUrl = versionUrl;
    this.featuresUrl = featuresUrl;
    this.current = currentVersion;
  }
  async check() {
    const [ver, flags] = await Promise.all([
      fetch(this.versionUrl, { cache: 'no-store' }).then(r=>r.json()),
      fetch(this.featuresUrl, { cache: 'no-store' }).then(r=>r.json()).catch(()=>({}))
    ]);

    // feature flags exposed globally (optional)
    window.__PALM_FLAGS__ = flags;

    if (this._isNewer(ver.app, this.current)) {
      this._notify(`New version ${ver.app} available. Updating…`);
      await this._hotReload();
    }
    // enforce SW minimum
    if (ver.minSW && navigator.serviceWorker?.controller) {
      navigator.serviceWorker.controller.postMessage({ kind:'ensure-sw', min: ver.minSW });
    }
  }
  _isNewer(remote, local) {
    const a = s=>s.split('.').map(n=>parseInt(n,10));
    const [r1,r2,r3] = a(remote), [l1,l2,l3] = a(local);
    if (r1!==l1) return r1>l1; if (r2!==l2) return r2>l2; return r3>l3;
  }
  async _hotReload() {
    // bust module cache and reload
    if ('caches' in window) { try { const keys = await caches.keys(); await Promise.all(keys.map(k=>caches.delete(k))); } catch {} }
    location.reload();
  }
  _notify(msg){ console.log('[Updater]', msg); }
}
