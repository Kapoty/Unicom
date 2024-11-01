self.addEventListener('install', (event) => {
  self.skipWaiting();
  caches.keys().then(function(names) {
    for (let name of names)
        caches.delete(name);
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients
      .matchAll({
        type: "window",
      })
      .then((clientList) => {
        for (const client of clientList) {
          return client.focus();
        }
        if (clients.openWindow) return clients.openWindow("/");
      }),
  );
});