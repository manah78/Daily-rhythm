// Daily Rhythm v16.4 My Prayer repair
const CACHE_VERSION = 'daily-rhythm-v1.0.0-phase1-incremental-voice-settings-v16-5';
const APP_CACHE = `${CACHE_VERSION}-app`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

const APP_SHELL = [
  './',
  './index.html',
  './css/command-results.css',
  './css/my-prayer-immersive-v14.css',
  './js/command-results.js',
  './js/my-prayer-immersive-v14.js',
  './js/reminders.js',
  './manifest.webmanifest'
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
        return (await caches.match(request)) || (await caches.match('./index.html')) || (await caches.match('./'));
      }
    })());
    return;
  }

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
      if (cached) { event.waitUntil(networkPromise); return cached; }
      const fresh = await networkPromise;
      return fresh || new Response('Offline', { status:503, headers:{ 'Content-Type':'text/plain; charset=utf-8' } });
    })());
  }
});

function openReminderDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('daily-rhythm-reminder-sw', 1);
    req.onupgradeneeded = () => req.result.createObjectStore('kv');
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function swPut(key, value) {
  const db = await openReminderDb();
  await new Promise((resolve, reject) => {
    const tx = db.transaction('kv', 'readwrite');
    tx.objectStore('kv').put(value, key);
    tx.oncomplete = resolve; tx.onerror = () => reject(tx.error);
  });
  db.close();
}

async function swGet(key) {
  const db = await openReminderDb();
  const value = await new Promise((resolve, reject) => {
    const tx = db.transaction('kv', 'readonly');
    const req = tx.objectStore('kv').get(key);
    req.onsuccess = () => resolve(req.result); req.onerror = () => reject(req.error);
  });
  db.close();
  return value;
}

self.addEventListener('message', event => {
  if (event.data?.type === 'daily-rhythm-reminder-auth') {
    event.waitUntil(swPut('auth', { clientId:event.data.clientId, clientToken:event.data.clientToken }));
  }
});

self.addEventListener('push', event => {
  if (!event.data) return;
  event.waitUntil((async () => {
    let data = {};
    try { data = event.data.json(); } catch (_) { data = { title:'Daily Rhythm', body:event.data.text() }; }
    const lang = data.lang === 'ar' ? 'ar' : 'en';
    const snoozeMinutes = Number(data.data?.snoozeMinutes || 10);
    await self.registration.showNotification(data.title || 'Daily Rhythm', {
      body: data.body || '',
      tag: data.tag || 'daily-rhythm-reminder',
      renotify: false,
      data: data.data || {},
      actions: [{ action:'snooze', title: lang === 'ar' ? `تأجيل ${snoozeMinutes}د` : `Snooze ${snoozeMinutes}m` }]
    });
  })());
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil((async () => {
    const blockId = event.notification.data?.blockId || '';
    const reminderId = event.notification.data?.reminderId || '';
    const snoozeMinutes = Number(event.notification.data?.snoozeMinutes || 10);

    if (event.action === 'snooze' && reminderId) {
      try {
        const auth = await swGet('auth');
        if (auth?.clientId && auth?.clientToken) {
          await fetch('/api/reminders/snooze', {
            method:'POST',
            headers:{ 'content-type':'application/json' },
            body:JSON.stringify({ ...auth, reminderId, minutes:snoozeMinutes })
          });
          return;
        }
      } catch (_) {}
    }

    const url = new URL('./', self.registration.scope);
    url.searchParams.set('reminderAction', event.action || 'open');
    if (blockId) url.searchParams.set('blockId', blockId);
    if (reminderId) url.searchParams.set('reminderId', reminderId);

    const windows = await self.clients.matchAll({ type:'window', includeUncontrolled:true });
    for (const client of windows) {
      if ('focus' in client) {
        if ('navigate' in client) await client.navigate(url.href);
        return client.focus();
      }
    }
    if (self.clients.openWindow) return self.clients.openWindow(url.href);
  })());
});
