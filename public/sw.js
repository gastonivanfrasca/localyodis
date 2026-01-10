// Service Worker para LocalYodis
// Maneja notificaciones en segundo plano y Periodic Background Sync

const CACHE_NAME = 'localyodis-v1';

// Función para obtener la URL base de la API
function getApiBaseUrl() {
  // En desarrollo, usar localhost:3000, en producción usar el mismo origin
  const origin = self.location.origin;
  if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
    return 'http://localhost:3000';
  }
  return origin;
}

// Instalación del Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Service Worker instalado');
  self.skipWaiting();
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Service Worker activado');
  event.waitUntil(self.clients.claim());
});

// Periodic Background Sync - se ejecuta periódicamente cuando la app está cerrada
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'check-rss-feeds') {
    console.log('[SW] Periodic sync ejecutado: check-rss-feeds');
    event.waitUntil(checkForNewItems());
  }
});

// Función para obtener datos desde IndexedDB (mejorada)
async function getStoredData() {
  return await getStoredDataFromIndexedDB();
}

// Función para fetch de feeds RSS
async function fetchRSSFeeds(sources) {
  try {
    const apiBaseUrl = getApiBaseUrl();
    const response = await fetch(`${apiBaseUrl}/api/rss/fetch-feeds`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        urls: sources.map(s => ({ id: s.id, url: s.url }))
      }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error('[SW] Error fetching RSS feeds:', error);
    return [];
  }
}

// Función para extraer link de un item RSS
function extractLink(item) {
  if (Array.isArray(item.link) && item.link.length > 0) {
    if (typeof item.link[0] === "object" && item.link[0]["$"]) {
      return item.link[0]["$"].href;
    }
    if (typeof item.link[0] === "string") return item.link[0];
  }
  if (typeof item.link === "string") return item.link;
  return item.id || "";
}

// Función para obtener título de un item RSS
function getRSSItemTitle(item) {
  if (!item.title) return "";
  return Array.isArray(item.title) ? item.title[0] : item.title;
}

// Función principal para verificar nuevos items
async function checkForNewItems() {
  try {
    console.log('[SW] ===== Verificando nuevos items =====');
    
    // Verificar permisos de notificación primero
    // En service worker, verificamos directamente con Notification.permission
    if (Notification.permission !== 'granted') {
      console.log('[SW] Permisos de notificación no otorgados - abortando');
      return;
    }
    
    // Siempre usar IndexedDB para obtener datos (más confiable en background)
    const storedData = await getStoredDataFromIndexedDB();
    
    if (!storedData || !storedData.sources || storedData.sources.length === 0) {
      console.log('[SW] No hay datos almacenados o no hay fuentes');
      return;
    }
    
    await processNewItems(storedData);
    console.log('[SW] ===== Verificación completada =====');
    
  } catch (error) {
    console.error('[SW] Error en checkForNewItems:', error);
  }
}

// Función para obtener datos desde IndexedDB
async function getStoredDataFromIndexedDB() {
  return new Promise((resolve) => {
    const request = indexedDB.open('localyodis', 1);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('storage')) {
        db.createObjectStore('storage');
      }
    };
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('storage')) {
        resolve({ sources: [], items: [], activeSources: [] });
        return;
      }
      
      const transaction = db.transaction(['storage'], 'readonly');
      const store = transaction.objectStore('storage');
      const getRequest = store.get('data');
      
      getRequest.onsuccess = () => {
        const storedValue = getRequest.result;
        const data = storedValue?.value || storedValue || { sources: [], items: [], activeSources: [] };
        resolve(data);
      };
      
      getRequest.onerror = () => {
        resolve({ sources: [], items: [], activeSources: [] });
      };
    };
    
    request.onerror = () => {
      resolve({ sources: [], items: [], activeSources: [] });
    };
  });
}

// Función para procesar nuevos items y enviar notificaciones
async function processNewItems(storedData) {
  console.log('[SW] processNewItems iniciado', {
    sourcesCount: storedData.sources?.length || 0,
    itemsCount: storedData.items?.length || 0,
    activeSourcesCount: storedData.activeSources?.length || 0,
  });
  
  const { sources = [], items: previousItems = [] } = storedData;
  
  // Filtrar solo fuentes con notificaciones habilitadas
  const sourcesWithNotifications = sources.filter(s => s.notificationsEnabled);
  
  console.log('[SW] Fuentes con notificaciones:', sourcesWithNotifications.length);
  
  if (sourcesWithNotifications.length === 0) {
    console.log('[SW] No hay fuentes con notificaciones habilitadas');
    return;
  }
  
  // Obtener solo fuentes activas
  const activeSources = sourcesWithNotifications.filter(s => 
    storedData.activeSources?.includes(s.id) ?? true
  );
  
  console.log('[SW] Fuentes activas con notificaciones:', activeSources.length);
  
  if (activeSources.length === 0) {
    console.log('[SW] No hay fuentes activas con notificaciones');
    return;
  }
  
  // Fetch de feeds RSS
  console.log('[SW] Fetching feeds RSS...');
  const fetchedItems = await fetchRSSFeeds(activeSources);
  
  console.log('[SW] Items obtenidos del feed:', fetchedItems.length);
  
  if (fetchedItems.length === 0) {
    console.log('[SW] No se obtuvieron items del feed');
    return;
  }
  
  // Detectar nuevos items
  // IMPORTANTE: Si no hay items previos, considerar todos como nuevos pero solo notificar una vez
  const previousItemLinks = new Set(previousItems.map(extractLink));
  const newItems = fetchedItems.filter(item => {
    const link = extractLink(item);
    return !previousItemLinks.has(link);
  });
  
  console.log('[SW] Items previos:', previousItems.length);
  console.log('[SW] Nuevos items detectados:', newItems.length);
  
  // Si no hay items previos, NO notificar (primera carga)
  // Solo notificar si hay items previos Y nuevos items
  if (newItems.length === 0) {
    console.log('[SW] No hay nuevos items');
    return;
  }
  
  if (previousItems.length === 0) {
    console.log('[SW] Primera carga - no se envían notificaciones para evitar spam');
    return;
  }
  
  // Verificar permisos de notificación antes de enviar
  if (Notification.permission !== 'granted') {
    console.log('[SW] Permisos de notificación no otorgados');
    return;
  }
  
  // Enviar notificaciones para nuevos items
  let notificationsSent = 0;
  for (const item of newItems) {
    const sourceId = item.source || "unknown";
    const source = activeSources.find(s => s.id === sourceId);
    
    if (source?.notificationsEnabled) {
      const sourceName = source.name || 'Unknown';
      const itemTitle = getRSSItemTitle(item);
      
      try {
        // Usar rutas absolutas para los iconos
        const iconPath = self.location.origin + '/pwa-192x192.png';
        const badgePath = self.location.origin + '/pwa-192x192.png';
        
        await self.registration.showNotification(`${sourceName}: ${itemTitle}`, {
          body: 'Nuevo artículo disponible',
          icon: iconPath,
          badge: badgePath,
          tag: `new-item-${sourceId}-${extractLink(item)}`,
          requireInteraction: false,
          data: {
            url: extractLink(item),
            sourceId: sourceId,
          },
        });
        notificationsSent++;
        console.log('[SW] Notificación enviada:', itemTitle);
      } catch (error) {
        console.error('[SW] Error enviando notificación:', error);
      }
    }
  }
  
  console.log(`[SW] Se enviaron ${notificationsSent} notificaciones de ${newItems.length} nuevos items`);
}

// Manejar mensajes desde la app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'STORAGE_DATA') {
    // Guardar datos en IndexedDB para uso en background sync
    saveStorageDataToIndexedDB(event.data.data);
  }
  
  if (event.data && event.data.type === 'CHECK_NOW') {
    // Verificar inmediatamente cuando se solicita desde la app
    event.waitUntil(checkForNewItems());
  }
});

// Guardar datos en IndexedDB
async function saveStorageDataToIndexedDB(data) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('localyodis', 1);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('storage')) {
        db.createObjectStore('storage');
      }
    };
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(['storage'], 'readwrite');
      const store = transaction.objectStore('storage');
      store.put(data, 'data');
      resolve();
    };
    
    request.onerror = () => {
      reject(new Error('Error abriendo IndexedDB'));
    };
  });
}

// Manejar clics en notificaciones
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientsList) => {
      // Si hay una ventana abierta, enfocarla
      for (const client of clientsList) {
        if (client.url === self.location.origin && 'focus' in client) {
          return client.focus();
        }
      }
      // Si no hay ventana abierta, abrir una nueva
      if (self.clients.openWindow) {
        return self.clients.openWindow('/');
      }
    })
  );
});
