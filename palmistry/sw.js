const C = 'lab-v1';
const ASSETS = [ '/', '/index.html', '/palmistry.html', '/assets/styles.css' ];

self.addEventListener('install', e=>{
  e.waitUntil(caches.open(C).then(c=>c.addAll(ASSETS)));
});
self.addEventListener('activate', e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==C).map(k=>caches.delete(k)))));
});
self.addEventListener('fetch', e=>{
  const url = new URL(e.request.url);
  if (url.pathname.endsWith('/manifest.json')) {
    // always network first for updates
    e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));
    return;
  }
  e.respondWith(
    caches.match(e.request).then(r=> r || fetch(e.request).then(res=>{
      const clone = res.clone();
      caches.open(C).then(c=>c.put(e.request, clone));
      return res;
    }))
  );
});
