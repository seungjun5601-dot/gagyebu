const CACHE = 'gagyebu-v5';
const ASSETS = [
  './',
  './index.html',
  './dc-runtime.js',
  './manifest.json',
  './firebase-config.js',
  './fonts/asset_1.woff2',
  './fonts/asset_3.woff2',
  './fonts/asset_5.woff2',
  './fonts/asset_7.woff2',
  './fonts/asset_9.woff2',
  './fonts/asset_11.woff2',
  './fonts/asset_13.woff2',
  './fonts/asset_15.woff2',
  './fonts/asset_17.woff2',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.url.includes('firebase') || e.request.url.includes('googleapis')) {
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(res => {
      if (res.ok && e.request.method === 'GET') {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
      }
      return res;
    }))
  );
});
