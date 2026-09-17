self.addEventListener('install', event => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const blockId = event.notification.data && event.notification.data.blockId;
  const action = event.action || 'open';
  const url = new URL('./', self.registration.scope);
  url.searchParams.set('reminderAction', action);
  if (blockId) url.searchParams.set('blockId', blockId);

  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of windows) {
      if ('focus' in client) {
        if ('navigate' in client) await client.navigate(url.href);
        return client.focus();
      }
    }
    if (self.clients.openWindow) return self.clients.openWindow(url.href);
  })());
});
