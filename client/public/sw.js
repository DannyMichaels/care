/* eslint-disable no-restricted-globals */

self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body,
    icon: data.icon || '/android-chrome-192x192.png',
    badge: '/android-chrome-192x192.png',
    vibrate: [200, 100, 200],
    data: data.data || {},
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Care', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const url = event.notification.data?.url || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      const existing = clients.find((c) => c.url.includes(url) && 'focus' in c);
      if (existing) {
        return existing.focus();
      }
      return self.clients.openWindow(url);
    })
  );
});
