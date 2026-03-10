// Service Worker para LocalYodis
// Maneja el shell offline y Web Push para nuevas publicaciones.

const APP_SHELL_CACHE = "localyodis-app-shell-v2";
const APP_SHELL_FILES = ["/index.html"];
const NOTIFICATION_DB_NAME = "localyodis-notification-actions";
const NOTIFICATION_DB_VERSION = 1;
const BOOKMARK_STORE = "bookmarks";

const openNotificationDb = () => new Promise((resolve, reject) => {
  const request = indexedDB.open(NOTIFICATION_DB_NAME, NOTIFICATION_DB_VERSION);

  request.onupgradeneeded = () => {
    const db = request.result;

    if (!db.objectStoreNames.contains(BOOKMARK_STORE)) {
      db.createObjectStore(BOOKMARK_STORE, { keyPath: "link" });
    }
  };

  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error);
});

const waitForTransaction = (transaction) => new Promise((resolve, reject) => {
  transaction.oncomplete = () => resolve();
  transaction.onerror = () => reject(transaction.error);
  transaction.onabort = () => reject(transaction.error);
});

const getStoredBookmark = async (link) => {
  if (!link) {
    return null;
  }

  const db = await openNotificationDb();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(BOOKMARK_STORE, "readonly");
    const request = transaction.objectStore(BOOKMARK_STORE).get(link);

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
};

const upsertStoredBookmark = async (bookmark) => {
  if (!bookmark?.link) {
    return;
  }

  const db = await openNotificationDb();
  const transaction = db.transaction(BOOKMARK_STORE, "readwrite");
  transaction.objectStore(BOOKMARK_STORE).put(bookmark);
  await waitForTransaction(transaction);
};

const removeStoredBookmark = async (link) => {
  if (!link) {
    return;
  }

  const db = await openNotificationDb();
  const transaction = db.transaction(BOOKMARK_STORE, "readwrite");
  transaction.objectStore(BOOKMARK_STORE).delete(link);
  await waitForTransaction(transaction);
};

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

  event.waitUntil((async () => {
    const payload = event.data.json();
    const title = payload.title || "LocalYodis";
    const bookmark = {
      title: payload.articleTitle || payload.body || title,
      link: payload.url || null,
      sourceUrl: payload.sourceUrl || null,
      sourceName: payload.sourceName || null,
      pubDate: payload.pubDate || null,
    };
    const isBookmarked = Boolean(await getStoredBookmark(bookmark.link));
    const options = {
      body: payload.body || "There is a new article available.",
      icon: "/pwa-192x192.png",
      badge: "/monochrome-icon.svg",
      actions: [
        {
          action: isBookmarked ? "remove-bookmark" : "bookmark",
          title: isBookmarked
            ? (payload.removeActionLabel || "Remove")
            : (payload.saveActionLabel || "Save"),
        },
      ],
      data: {
        url: payload.url || "/",
        sourceUrl: payload.sourceUrl || null,
        itemKey: payload.itemKey || null,
        bookmark,
      },
    };

    await self.registration.showNotification(title, options);
  })());
});

const buildBookmarkActionUrl = (bookmark, mode) => {
  const params = new URLSearchParams({
    notificationAction: "toggle-bookmark",
    mode,
    title: bookmark?.title || "",
    link: bookmark?.link || "",
    sourceUrl: bookmark?.sourceUrl || "",
    sourceName: bookmark?.sourceName || "",
    pubDate: bookmark?.pubDate || "",
  });

  return `/?${params.toString()}`;
};

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "bookmark" || event.action === "remove-bookmark") {
    const bookmark = event.notification.data?.bookmark;
    const mode = event.action === "remove-bookmark" ? "remove" : "add";

    event.waitUntil((async () => {
      if (mode === "remove") {
        await removeStoredBookmark(bookmark?.link);
      } else {
        await upsertStoredBookmark(bookmark);
      }

      const clients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      const existingClient = clients.find((client) => "focus" in client);

      if (existingClient) {
        existingClient.postMessage({
          type: "push-notification-bookmark-toggle",
          bookmark,
          mode,
        });
        await existingClient.focus();
        return;
      }

      await self.clients.openWindow(buildBookmarkActionUrl(bookmark, mode));
    })());

    return;
  }

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
