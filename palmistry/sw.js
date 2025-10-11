// ========= Primary Cache (Lab shell) =========
const C = 'lab-v1';
const ASSETS = ['/', '/index.html', '/palmistry.html', '/assets/styles.css'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(C).then(c => c.addAll(ASSETS)));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== C && !k.startsWith('palmistry-')).map(k => caches.delete(k)))
    )
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.pathname.endsWith('/manifest.json')) {
    // always network-first for updates
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
    return;
  }
  e.respondWith(
    caches.match(e.request).then(
      r =>
        r ||
        fetch(e.request).then(res => {
          const clone = res.clone();
          caches.open(C).then(c => c.put(e.request, clone));
          return res;
        })
    )
  );
});

// ========= Secondary Cache (Palmistry offline pages) =========
const CACHE = 'palmistry-v3-1';
const PALM_ASSETS = [
  'index.html',
  'palmistry_photo.html',
  'result.html',
  'compare.html',
  'detect.html',
  'manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(PALM_ASSETS)));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE && !k.startsWith('lab-')).map(k => caches.delete(k)))
    )
  );
});

self.addEventListener('fetch', e => {
  // Fallback only if not handled above
  if (e.defaultPrevented) return;
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
