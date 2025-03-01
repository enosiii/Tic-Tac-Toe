const CACHE_NAME = 'tic-tac-toe-v2'; // Updated cache name
const ASSETS = [
  '/Tic-Tac-Toe/',
  '/Tic-Tac-Toe/index.html',
  '/Tic-Tac-Toe/styles.css',
  '/Tic-Tac-Toe/main.js',
  '/Tic-Tac-Toe/mode.js',
  '/Tic-Tac-Toe/sw.js',
  '/Tic-Tac-Toe/manifest.json',
  '/Tic-Tac-Toe/ttt192.png',
  '/Tic-Tac-Toe/ttt512.png',
  '/Tic-Tac-Toe/tick.mp3',
  '/Tic-Tac-Toe/game-win.mp3',
  '/Tic-Tac-Toe/game-over.mp3'
];

// Install the service worker and cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Fetch assets from cache or network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});
