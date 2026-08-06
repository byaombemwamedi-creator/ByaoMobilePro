const CACHE_NAME = 'byao-mobile-v2';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './admin.html',
  './fundi.html',
  './mfanyabiashara.html',
  './mteja.html',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/lucide@latest'
];

// Installa Service Worker na uhifadhi Cache
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Anzisha Service Worker na ufute Cache za zamani
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Chukua data kutoka Cache ikiwa hakuna mtandao (Network-first with Cache Fallback)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request)
      .then((response) => {
        // Hifadhi nakala mpya ikiwa mtandao upo
        const resClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(e.request, resClone);
        });
        return response;
      })
      .catch(() => {
        // Mtandao ukikosa, rudisha faili kutoka Cache
        return caches.match(e.request);
      })
  );
});
