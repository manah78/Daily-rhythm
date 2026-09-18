const CACHE_VERSION = 'daily-rhythm-v2';
const APP_CACHE = `${CACHE_VERSION}-app`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/img-80997302b9dd.webp',
  './assets/img-a48e38a2ee45.jpg',
  './assets/img-ecbb509ed6d7.webp',
  './assets/img-b4806657f5c1.jpg',
  './assets/img-ec37f878fd57.webp',
  './assets/img-8277f6848c60.png',
  './assets/img-ad6a3594d6f9.webp',
  './assets/img-602aeaafd195.webp',
  './assets/img-7c7d6a20b96b.webp',
  './assets/img-744a017c18ed.png',
  './assets/img-e57d969fd333.png',
  './assets/img-693b6daa601b.png',
  './assets/img-05dab10648c7.png',
  './assets/img-adb1deaa79e8.png',
  './assets/img-8f78f11bbb4b.png',
  './assets/img-df7ff90653fc.png',
  './assets/img-0c823d1fafc7.png',
  './assets/img-01e664b5fffe.png',
  './assets/img-6dc593d4e650.webp',
  './assets/img-b4914b15689d.webp',
  './assets/img-c1130f847fef.webp',
  './assets/img-a8c20542a64c.webp',
  './assets/img-3e60ebf52765.webp',
  './assets/img-e16cc7c88bd6.webp',
  './assets/img-0c0185c7926e.webp',
  './assets/img-aa6157a8c4b7.webp'
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
