// Utilidad para manejar Periodic Background Sync y comunicación con el Service Worker

export interface BackgroundSyncConfig {
  sources: Array<{
    id: string;
    url: string;
    name: string | null | undefined;
    notificationsEnabled?: boolean;
  }>;
  items: any[];
  activeSources: string[];
}

/**
 * Registra Periodic Background Sync para verificar feeds RSS periódicamente
 */
export async function registerPeriodicSync(): Promise<boolean> {
  if (!('serviceWorker' in navigator)) {
    console.warn('Service Worker no está soportado');
    return false;
  }

  if (!('PeriodicBackgroundSync' in window)) {
    console.warn('Periodic Background Sync no está soportado');
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    
    // Verificar si ya tenemos permisos
    const status = await (navigator as any).permissions.query({
      name: 'periodic-background-sync' as PermissionName,
    });

    if (status.state === 'denied') {
      console.warn('Periodic Background Sync está denegado');
      return false;
    }

    try {
      // Registrar el tag para periodic sync
      await (registration as any).periodicSync.register('check-rss-feeds', {
        minInterval: 60 * 60 * 1000, // 1 hora mínimo
      });
      console.log('Periodic Background Sync registrado exitosamente');
      return true;
    } catch (error: any) {
      // Si el error es que ya está registrado, está bien
      if (error.name === 'InvalidStateError') {
        console.log('Periodic Background Sync ya está registrado');
        return true;
      }
      console.error('Error registrando Periodic Background Sync:', error);
      return false;
    }
  } catch (error) {
    console.error('Error en registerPeriodicSync:', error);
    return false;
  }
}

/**
 * Envía datos de storage al Service Worker para que pueda usarlos en background sync
 */
export async function sendStorageDataToSW(data: BackgroundSyncConfig): Promise<void> {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    
    // Enviar datos al service worker usando IndexedDB
    await saveDataToIndexedDB(data);
    
    // También enviar por mensaje como respaldo
    if (registration.active) {
      registration.active.postMessage({
        type: 'STORAGE_DATA',
        data: data,
      });
    }
  } catch (error) {
    console.error('Error enviando datos al Service Worker:', error);
  }
}

/**
 * Solicita al Service Worker que verifique inmediatamente los feeds
 */
export async function triggerImmediateCheck(): Promise<void> {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    if (registration.active) {
      registration.active.postMessage({
        type: 'CHECK_NOW',
      });
    }
  } catch (error) {
    console.error('Error solicitando verificación inmediata:', error);
  }
}

/**
 * Guarda datos en IndexedDB para que el Service Worker pueda accederlos
 */
async function saveDataToIndexedDB(data: BackgroundSyncConfig): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('localyodis', 1);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('storage')) {
        db.createObjectStore('storage');
      }
    };

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
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

/**
 * Verifica si Periodic Background Sync está soportado y disponible
 */
export function isPeriodicSyncSupported(): boolean {
  return (
    'serviceWorker' in navigator &&
    'PeriodicBackgroundSync' in window
  );
}

/**
 * Obtiene el estado del registro de Periodic Background Sync
 */
export async function getPeriodicSyncStatus(): Promise<{
  supported: boolean;
  registered: boolean;
  permission: 'granted' | 'denied' | 'prompt' | 'unknown';
}> {
  const supported = isPeriodicSyncSupported();

  if (!supported) {
    return {
      supported: false,
      registered: false,
      permission: 'unknown',
    };
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const status = await (navigator as any).permissions.query({
      name: 'periodic-background-sync' as PermissionName,
    });

    const tags = await (registration as any).periodicSync.getTags();
    const registered = tags.includes('check-rss-feeds');

    return {
      supported: true,
      registered,
      permission: status.state as 'granted' | 'denied' | 'prompt',
    };
  } catch (error) {
    console.error('Error obteniendo estado de Periodic Sync:', error);
    return {
      supported: true,
      registered: false,
      permission: 'unknown',
    };
  }
}






