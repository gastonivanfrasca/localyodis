import type { Items } from "../types/storage";

const DB_NAME = "localyodis-notification-actions";
const DB_VERSION = 1;
const BOOKMARK_STORE = "bookmarks";

const canUseIndexedDb = () => typeof indexedDB !== "undefined";

const waitForRequest = <T>(request: IDBRequest<T>) => new Promise<T>((resolve, reject) => {
  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error);
});

const waitForTransaction = (transaction: IDBTransaction) => new Promise<void>((resolve, reject) => {
  transaction.oncomplete = () => resolve();
  transaction.onerror = () => reject(transaction.error);
  transaction.onabort = () => reject(transaction.error);
});

const openNotificationActionDb = async () => {
  const request = indexedDB.open(DB_NAME, DB_VERSION);

  request.onupgradeneeded = () => {
    const db = request.result;

    if (!db.objectStoreNames.contains(BOOKMARK_STORE)) {
      db.createObjectStore(BOOKMARK_STORE, { keyPath: "link" });
    }
  };

  return waitForRequest(request);
};

export const syncNotificationBookmarks = async (bookmarks: Items[]) => {
  if (!canUseIndexedDb()) {
    return;
  }

  const db = await openNotificationActionDb();
  const transaction = db.transaction(BOOKMARK_STORE, "readwrite");
  const store = transaction.objectStore(BOOKMARK_STORE);

  store.clear();

  bookmarks.forEach((bookmark) => {
    if (!bookmark.link) {
      return;
    }

    store.put(bookmark);
  });

  await waitForTransaction(transaction);
};
