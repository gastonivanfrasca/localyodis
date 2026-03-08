// Service Worker para LocalYodis
// Maneja el shell offline y Web Push para nuevas publicaciones.

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

self.addEventListener("push", (event) => {
  if (!event.data) {
    return;
  }

  const payload = event.data.json();
  const title = payload.title || "LocalYodis";
  const options = {
    body: payload.body || "There is a new article available.",
    icon: "/pwa-192x192.png",
    badge: "/pwa-64x64.png",
    data: {
      url: payload.url || "/",
      sourceUrl: payload.sourceUrl || null,
      itemKey: payload.itemKey || null,
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const destination = event.notification.data?.url || "/";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      const existingClient = clients.find((client) => "focus" in client);

      if (existingClient) {
        existingClient.postMessage({ type: "push-notification-click", url: destination });
        return existingClient.focus().then(() => existingClient.navigate(destination));
      }

      return self.clients.openWindow(destination);
    })
  );
});
