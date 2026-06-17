const CACHE_NAME = 'sarkariboard-cache-v2';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/robots.txt'
];

// On install, eagerly cache our critical entry app shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Clean up stale, older caches on activation
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log('[Service Worker] Deleting obsolete cache:', name);
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Dynamic response handling with Network-First strategy for pages / posts, and Cache-First / Stale-While-Revalidate for critical core assets
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests (such as analytics beacons or POST requests, e.g. /api/assistant)
  if (request.method !== 'GET') {
    return;
  }

  // Handle Chrome extension requests or other non-http resources gracefully
  if (!request.url.startsWith('http')) {
    return;
  }

  // Network-First strategy for HTML / Pages and Dynamic Post Details
  // This ensures users always get up-to-the-minute updates, but can still retrieve the page from cache if they drop offline!
  const isHtmlPage = request.mode === 'navigate' || url.pathname.startsWith('/post/');
  const isApi = url.pathname.startsWith('/api/');

  if (isHtmlPage && !isApi) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          // Clone the response and save it to the cache
          if (networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Fetch failed (network drop) -> retrieve matching route or main shell fallback
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // Fallback to /index.html if specifically navigating
            return caches.match('/');
          });
        })
    );
    return;
  }

  // Stale-While-Revalidate strategy for internal scripts, styles, and media assets
  // This makes the app launch insanely fast on repeating visits while updating cache in background
  const isLocalAsset = url.origin === self.location.origin && 
    (url.pathname.includes('/src/') || 
     url.pathname.includes('/node_modules/') || 
     url.pathname.endsWith('.js') || 
     url.pathname.endsWith('.css') || 
     url.pathname.endsWith('.png') || 
     url.pathname.endsWith('.jpg') || 
     url.pathname.endsWith('.svg') || 
     url.pathname.includes('@vite') ||
     url.pathname.endsWith('.ico'));

  if (isLocalAsset) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request).then((networkResponse) => {
          if (networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        }).catch(() => {
          // If offline fetch fails, fail-safe to cached response, or just ignore
        });

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // Default behavior: Network-First (handles google fonts, assets, secondary requests)
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache successful calls
        if (response.status === 200 && (url.protocol === 'http:' || url.protocol === 'https:')) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(request);
      })
  );
});
