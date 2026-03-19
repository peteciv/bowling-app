const CACHE_NAME = 'bowling-app-v2';
const OFFLINE_URL = '/offline.html';

// Assets to cache on install
const PRECACHE_ASSETS = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
];

// Install event - cache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) return;

  const url = new URL(event.request.url);
  const isNavigationRequest = event.request.mode === 'navigate';
  const isApiRequest = url.pathname.startsWith('/api/');

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Keep API responses network-only to avoid stale app data.
        if (!isApiRequest && response.ok && response.type === 'basic') {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }

        return response;
      })
      .catch(() =>
        caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse && !isApiRequest) {
            return cachedResponse;
          }

          // If it's a navigation request, show offline page
          if (isNavigationRequest) {
            return caches.match(OFFLINE_URL);
          }

          return new Response('Offline', {
            status: 503,
            statusText: 'Service Unavailable',
          });
        })
      )
  );
});
