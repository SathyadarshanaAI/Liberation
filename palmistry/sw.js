const CACHE = "sathyadarshana-v10.4";
const FILES = [
  "/palmistry/index.html",
  "/palmistry/main.js",
  "/palmistry/modules/core.js",
  "/palmistry/modules/bus.js",
  "/palmistry/modules/camera.js",
  "/palmistry/modules/report.js",
  "/palmistry/modules/ai.js",
  "/palmistry/modules/pdf.js",
  "/palmistry/assets/icon.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES)));
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});
