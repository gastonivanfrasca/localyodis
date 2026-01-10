// Service Worker para LocalYodis
// Mantiene el registro básico sin notificaciones push ni background sync

const APP_SHELL_CACHE = "localyodis-app-shell-v1";
const APP_SHELL_FILES = ["/index.html"];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(APP_SHELL_CACHE).then((cache) => cache.addAll(APP_SHELL_FILES))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  if (event.request.mode !== "navigate") {
    return;
  }

  event.respondWith(
    caches.match("/index.html").then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch("/index.html", { cache: "no-store" });
    })
  );
});
