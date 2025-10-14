// sw.js
const CACHE = "qpa-v46-" + (self.crypto?.randomUUID?.() || Date.now());
const ASSETS = ["./","./index.html","./app.js","./manifest.json"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))
  ).then(()=>self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  if (e.request.method!=="GET") return;
  e.respondWith(
    caches.match(e.request).then(cached =>
      cached || fetch(e.request).then(res=>{
        const copy=res.clone();
        caches.open(CACHE).then(c=>c.put(e.request,copy)).catch(()=>{});
        return res;
      }).catch(()=>caches.match("./index.html"))
    )
  );
});
