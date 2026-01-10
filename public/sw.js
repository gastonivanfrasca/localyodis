// Service Worker para LocalYodis
// Mantiene el registro básico sin notificaciones push ni background sync

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});
