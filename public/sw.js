// Service Worker para LocalYodis
// Mantiene el registro básico sin notificaciones push ni background sync

const APP_SHELL_CACHE = "localyodis-app-shell-v2";
const APP_SHELL_FILES = ["/index.html"];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(APP_SHELL_CACHE).then((cache) => cache.addAll(APP_SHELL_FILES))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key !== APP_SHELL_CACHE)
          .map((key) => caches.delete(key))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.mode !== "navigate") {
    return;
  }

  event.respondWith(
    (async () => {
      try {
        const response = await fetch("/index.html", { cache: "no-store" });
        const cache = await caches.open(APP_SHELL_CACHE);
        await cache.put("/index.html", response.clone());
        return response;
      } catch (error) {
        const cachedResponse = await caches.match("/index.html");
        if (cachedResponse) {
          return cachedResponse;
        }
        throw error;
      }
    })()
  );
});
