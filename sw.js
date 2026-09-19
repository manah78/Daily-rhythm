const CACHE_VERSION = 'daily-rhythm-v12-language-relative';
const APP_CACHE = `${CACHE_VERSION}-app`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/moon-new.webp',
  './assets/moon-waxing-crescent.webp',
  './assets/moon-first-quarter.webp',
  './assets/moon-waxing-gibbous.webp',
  './assets/moon-full.webp',
  './assets/moon-waning-gibbous.webp',
  './assets/moon-last-quarter.webp',
  './assets/moon-waning-crescent.webp',
  './assets/scholar-biruni-measurement.webp',
  './assets/scholar-haytham-optics.webp',
  './assets/scholar-khwarizmi-algebra.webp',
  './assets/scholar-zahrawi-instruments.webp',
  './assets/scholar-idrisi-cartography.webp'
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(APP_CACHE);
    await cache.addAll(APP_SHELL);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keep = new Set([APP_CACHE, RUNTIME_CACHE]);
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => !keep.has(key)).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  // Network-first navigation: published versions appear quickly,
  // cached shell remains available when offline.
  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(request);
        if (fresh && fresh.ok) {
          const cache = await caches.open(APP_CACHE);
          await cache.put('./index.html', fresh.clone());
        }
        return fresh;
      } catch (_) {
        return (await caches.match(request)) ||
               (await caches.match('./index.html')) ||
               (await caches.match('./'));
      }
    })());
    return;
  }

  // Same-origin static resources: instant cached response + background refresh.
  if (url.origin === self.location.origin) {
    event.respondWith((async () => {
      const cached = await caches.match(request);
      const networkPromise = fetch(request).then(async response => {
        if (response && response.ok && response.type === 'basic') {
          const cache = await caches.open(RUNTIME_CACHE);
          await cache.put(request, response.clone());
        }
        return response;
      }).catch(() => null);

      if (cached) {
        event.waitUntil(networkPromise);
        return cached;
      }

      const fresh = await networkPromise;
      if (fresh) return fresh;

      return new Response('Offline', {
        status: 503,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      });
    })());
  }
});

self.addEventListener('notificationclick', event => {
  event.notification.close();

  const blockId = event.notification.data && event.notification.data.blockId;
  const action = event.action || 'open';
  const url = new URL('./', self.registration.scope);
  url.searchParams.set('reminderAction', action);
  if (blockId) url.searchParams.set('blockId', blockId);

  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    });

    for (const client of windows) {
      if ('focus' in client) {
        if ('navigate' in client) await client.navigate(url.href);
        return client.focus();
      }
    }

    if (self.clients.openWindow) {
      return self.clients.openWindow(url.href);
    }
  })());
});
