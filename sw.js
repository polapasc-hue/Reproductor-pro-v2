const V='rp-v7',CORE=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!=='GET'||r.headers.has('range')||!r.url.startsWith('http'))return;
  e.respondWith(caches.match(r).then(cached=>{
    const net=fetch(r).then(res=>{
      if(res&&(res.status===200||res.type==='opaque')){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp)).catch(()=>{})}
      return res;
    }).catch(()=>cached||(r.mode==='navigate'?caches.match('./index.html'):Response.error()));
    return cached||net;
  }));
});
