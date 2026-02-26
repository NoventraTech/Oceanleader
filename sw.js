/**
 * Ocean Leader Shipping & Logistics - Service Worker
 * Enables offline functionality and PWA features
 * Version: 1.0.0
 */

const CACHE_VERSION = 'v1';
const CACHE_NAME = `ocean-leader-${CACHE_VERSION}`;
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/css/responsive.css',
  '/js/main.js',
  '/logo.svg',
  '/favicon.svg',
  '/manifest.json'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .catch((err) => {
        console.error('Service Worker: Cache installation failed', err);
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Service Worker: Removing old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Handle GET requests
  if (event.request.method === 'GET') {
    event.respondWith(
      caches.match(event.request)
        .then((cached) => {
          // Return cached if available
          if (cached) {
            return cached;
          }

          // Fetch from network
          return fetch(event.request)
            .then((response) => {
              // Check for valid response
              if (!response || response.status !== 200 || response.type === 'error') {
                return response;
              }

              // Clone response
              const responseToCache = response.clone();

              // Cache successful responses
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });

              return response;
            })
            .catch(() => {
              // Offline fallback
              console.log('Service Worker: Fetch failed, returning offline page');
              return new Response('You are offline', {
                status: 503,
                statusText: 'Service Unavailable',
                headers: new Headers({
                  'Content-Type': 'text/plain'
                })
              });
            });
        })
    );
  }
});

// Message handler for cache updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys().then((cacheNames) => {
      cacheNames.forEach((cacheName) => {
        caches.delete(cacheName);
      });
    });
  }
});

// Background sync for deferred actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-form') {
    event.waitUntil(
      caches.match('/index.html')
        .then((response) => {
          return response || fetch('/index.html');
        })
    );
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const options = {
    body: data.body || 'Ocean Leader Shipping & Logistics',
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    tag: data.tag || 'ocean-leader',
    requireInteraction: false,
    data: {
      url: data.url || '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Ocean Leader', options)
  );
});

// Notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (let client of clientList) {
          if (client.url === event.notification.data.url && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(event.notification.data.url);
        }
      })
  );
});

console.log('🚢 Ocean Leader Service Worker Loaded');
