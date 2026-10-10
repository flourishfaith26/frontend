self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const conversationId = event.notification.data?.conversationId;
  if (!conversationId) return;

  event.waitUntil((async () => {
    const windowClients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of windowClients) {
      if ('focus' in client) {
        await client.focus();
        client.postMessage({ type: 'OPEN_CONVERSATION', conversationId });
        return;
      }
    }

    const url = new URL('/dashboard', self.location.origin);
    url.searchParams.set('conversationId', conversationId);
    await self.clients.openWindow(url.toString());
  })());
});

self.addEventListener('fetch', (e) => {
  // Simple pass-through fetch to satisfy PWA installability requirements
  // In a production app, we would cache assets here for offline support
  e.respondWith(
    fetch(e.request).catch(() => {
      return new Response('You are offline. Please check your connection.');
    })
  );
});
