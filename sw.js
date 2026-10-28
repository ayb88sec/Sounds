/* Najma offline cache. Pages update from the internet when online and fall back to the saved copy offline. */
const CACHE="najma-v13";
const FILES=["home.html","parent.html","arabic.html","numbers-ar.html","numbers-en.html","islam.html","iman.html","index.html","sight.html","words.html","name.html","cvc.html","sentences.html","shapes.html","writing.html","kit.js","kit.css","extras.js","audio/phonics-uk.json",
  "supa.js","profile.js","writepad.js","icon.png","audio/clips.enc","audio/clips2.enc","audio/islam.enc","audio/iman.enc","audio/numbers.enc","arabic2.html"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>Promise.all(FILES.map(f=>c.add(f).catch(()=>{})))).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const r=e.request;if(r.method!=="GET")return;const u=new URL(r.url);
  const isFont=/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)||u.hostname==="cdnjs.cloudflare.com";
  if(isFont){e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>{const cp=res.clone();caches.open(CACHE).then(c=>c.put(r,cp));return res})));return}
  if(u.origin!==location.origin)return;
  e.respondWith(fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(CACHE).then(c=>c.put(r,cp))}return res})
    .catch(()=>caches.match(r,{ignoreSearch:false}).then(hit=>hit||caches.match(r,{ignoreSearch:true}))));
});
