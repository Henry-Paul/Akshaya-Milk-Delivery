const CACHE_NAME = 'akshaya-milk-v4';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/js/app-selector.js',
  '/js/customer-app.js',
  '/js/agency-app.js',
  '/js/owner-app.js',
  '/js/main.js',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});
