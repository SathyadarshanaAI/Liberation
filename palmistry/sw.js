const SW_VERSION = '1.2.0';
const CACHE = 'palmistry-v' + SW_VERSION;
const ASSETS = [
  './','./index.html','./app.js','./modules/ui.js','./modules/camera.js',
  './modules/analyzer.js','./modules/pdf.js','./modules/storage.js','./modules/updater.js'
];

self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate', e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))))
});
self.addEventListener('fetch', e=>{
  const url = new URL(e.request.url);
  if (url.origin===location.origin) {
    e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
  }
});
self.addEventListener('message', e=>{
  if (e.data?.kind==='ensure-sw') {
    // if remote minSW > SW_VERSION → trigger update
    // (simple compare; real compare like updater)
    // optional: self.registration.update();
  }
});
