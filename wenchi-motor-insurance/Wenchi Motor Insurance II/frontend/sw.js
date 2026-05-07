const CACHE_NAME = 'wenchi-cache-v2';
const URLS_TO_CACHE = [
  './',
  './index.html',
  './login.html',
  './signup.html',
  './admin.html',
  './manifest.json',
  './Logo 1.0.png',
  './css/styles.css',
  './css/admin.css',
  './css/local-icons.css',
  './js/app.js',
  './js/admin.js',
  './assets/icons/fa/bars.svg',
  './assets/icons/fa/bolt.svg',
  './assets/icons/fa/bullseye.svg',
  './assets/icons/fa/car-side.svg',
  './assets/icons/fa/chart-line.svg',
  './assets/icons/fa/chart-simple.svg',
  './assets/icons/fa/circle-check.svg',
  './assets/icons/fa/dollar-sign.svg',
  './assets/icons/fa/envelope.svg',
  './assets/icons/fa/file-csv.svg',
  './assets/icons/fa/file-lines.svg',
  './assets/icons/fa/id-card.svg',
  './assets/icons/fa/lock.svg',
  './assets/icons/fa/mobile-screen-button.svg',
  './assets/icons/fa/money-bill-transfer.svg',
  './assets/icons/fa/money-bill-wave.svg',
  './assets/icons/fa/phone.svg',
  './assets/icons/fa/rotate.svg',
  './assets/icons/fa/shield-halved.svg',
  './assets/icons/fa/user.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(k => {
          if (k !== CACHE_NAME) return caches.delete(k);
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
