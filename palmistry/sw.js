const CACHE="qpa-v46-"+(self.crypto?.randomUUID?.()||Date.now());
const ASSETS=["./","./index.html","./app.js","./manifest.json"];

self.addEventListener("install",e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener("activate",e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))))
  self.clients.claim();
});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  e.respondWith(
    caches.match(e.request).then(c=>c||fetch(e.request).then(r=>{
      const copy=r.clone(); caches.open(CACHE).then(cc=>cc.put(e.request,copy)); return r;
    }).catch(()=>caches.match("./index.html")))
  );
});
