// Background Sync utility for LocalYodis
// Handles communication between main app and service worker

interface BackgroundOperation {
  type: string;
  operation: string;
  queuedAt: string;
  [key: string]: unknown;
}

interface SyncEventData {
  type: string;
  tag?: string;
  count?: number;
}

export class BackgroundSyncManager {
  private static instance: BackgroundSyncManager;
  private serviceWorkerRegistration: ServiceWorkerRegistration | null = null;

  private constructor() {
    this.initializeServiceWorker();
  }

  public static getInstance(): BackgroundSyncManager {
    if (!BackgroundSyncManager.instance) {
      BackgroundSyncManager.instance = new BackgroundSyncManager();
    }
    return BackgroundSyncManager.instance;
  }

  private async initializeServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        this.serviceWorkerRegistration = await navigator.serviceWorker.ready;
        
        // Listen for messages from service worker
        navigator.serviceWorker.addEventListener('message', this.handleServiceWorkerMessage.bind(this));
        
        console.log('Background sync manager initialized with generated SW');
      } catch (error) {
        console.error('Failed to initialize service worker:', error);
      }
    }
  }

  private handleServiceWorkerMessage(event: MessageEvent) {
    const { type, tag } = event.data;
    
    switch (type) {
      case 'BACKGROUND_SYNC_STARTED':
        console.log('Background sync started:', tag);
        this.notifyApp('sync-started', { type: 'sync-started', tag });
        break;
        
      case 'BACKGROUND_SYNC_COMPLETED':
        console.log('Background sync completed:', tag);
        this.notifyApp('sync-completed', { type: 'sync-completed', tag });
        break;
        
      case 'PERIODIC_SYNC_STARTED':
        console.log('Periodic sync started:', tag);
        this.notifyApp('periodic-sync-started', { type: 'periodic-sync-started', tag });
        break;
        
      case 'PERIODIC_SYNC_COMPLETED':
        console.log('Periodic sync completed:', tag);
        this.notifyApp('periodic-sync-completed', { type: 'periodic-sync-completed', tag });
        break;
        
      default:
        console.log('Unknown service worker message:', event.data);
    }
  }

  private notifyApp(_eventType: string, data: SyncEventData) {
    // Dispatch custom events that components can listen to
    const event = new CustomEvent('background-sync', {
      detail: data
    });
    window.dispatchEvent(event);
  }

  // Register for background sync when user action fails
  public async registerBackgroundSync(): Promise<void> {
    // Since we're using generateSW, implement background sync through storage and network events
    try {
      if ('sync' in window.ServiceWorkerRegistration.prototype && this.serviceWorkerRegistration) {
        // @ts-expect-error - sync is experimental
        await this.serviceWorkerRegistration.sync.register('rss-background-sync');
        console.log('Background sync registered');
      } else {
        // Fallback: use network status and storage for background sync simulation
        console.log('Using fallback background sync with network events');
        this.setupFallbackBackgroundSync();
      }
    } catch (error) {
      console.error('Failed to register background sync:', error);
      this.setupFallbackBackgroundSync();
    }
  }

  private setupFallbackBackgroundSync() {
    // Listen for network coming back online
    window.addEventListener('online', () => {
      console.log('Network restored - processing queued syncs');
      this.processPendingOperations();
    });
  }

  private async processPendingOperations() {
    try {
      const pendingOps = this.getPendingOperations();
      if (pendingOps.length > 0) {
        this.notifyApp('sync-started', { type: 'sync-started', count: pendingOps.length });
        
        // Process pending operations
        for (const op of pendingOps) {
          // Emit custom event for each operation
          const event = new CustomEvent('process-pending-operation', { detail: op });
          window.dispatchEvent(event);
        }
        
        this.notifyApp('sync-completed', { type: 'sync-completed', count: pendingOps.length });
      }
    } catch (error) {
      console.error('Failed to process pending operations:', error);
    }
  }

  private getPendingOperations(): BackgroundOperation[] {
    try {
      const pending = localStorage.getItem('pending_background_operations');
      return pending ? JSON.parse(pending) : [];
    } catch {
      return [];
    }
  }

  public queueOperation(operation: Omit<BackgroundOperation, 'queuedAt'>) {
    try {
      const pending = this.getPendingOperations();
      const operationWithTimestamp: BackgroundOperation = {
        ...operation,
        queuedAt: new Date().toISOString()
      } as BackgroundOperation;
      pending.push(operationWithTimestamp);
      localStorage.setItem('pending_background_operations', JSON.stringify(pending));
      console.log('Operation queued for background sync');
    } catch (error) {
      console.error('Failed to queue operation:', error);
    }
  }

  // Register for periodic sync (requires user interaction)
  public async registerPeriodicSync(): Promise<void> {
    if (!this.serviceWorkerRegistration) {
      console.warn('Service worker not ready for periodic sync');
      return;
    }

    try {
      if ('periodicSync' in this.serviceWorkerRegistration) {
        // @ts-expect-error - periodicSync is experimental
        await this.serviceWorkerRegistration.periodicSync.register('rss-periodic-sync', {
          minInterval: 24 * 60 * 60 * 1000, // 24 hours
        });
        console.log('Periodic sync registered');
      } else {
        console.warn('Periodic sync not supported');
      }
    } catch (error) {
      console.error('Failed to register periodic sync:', error);
    }
  }

  // Send message to service worker
  public sendMessageToServiceWorker(message: Record<string, unknown>): void {
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage(message);
    }
  }

  // Check if background sync is supported
  public isBackgroundSyncSupported(): boolean {
    return 'serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype;
  }

  // Check if periodic sync is supported
  public isPeriodicSyncSupported(): boolean {
    return 'serviceWorker' in navigator && 'periodicSync' in window.ServiceWorkerRegistration.prototype;
  }

  // Get sync capabilities
  public getSyncCapabilities() {
    return {
      backgroundSync: this.isBackgroundSyncSupported(),
      periodicSync: this.isPeriodicSyncSupported(),
      serviceWorker: 'serviceWorker' in navigator
    };
  }
}

// Export singleton instance
export const backgroundSyncManager = BackgroundSyncManager.getInstance();

// Hook for React components
export function useBackgroundSync() {
  const [syncStatus, setSyncStatus] = React.useState<string>('idle');
  const [capabilities] = React.useState(() => backgroundSyncManager.getSyncCapabilities());

  React.useEffect(() => {
    const handleBackgroundSync = (event: CustomEvent) => {
      const { type, tag } = event.detail;
      setSyncStatus(`${type}-${tag}`);
      
      // Reset status after 3 seconds
      setTimeout(() => setSyncStatus('idle'), 3000);
    };

    window.addEventListener('background-sync', handleBackgroundSync as EventListener);
    
    return () => {
      window.removeEventListener('background-sync', handleBackgroundSync as EventListener);
    };
  }, []);

  return {
    syncStatus,
    capabilities,
    registerBackgroundSync: backgroundSyncManager.registerBackgroundSync.bind(backgroundSyncManager),
    registerPeriodicSync: backgroundSyncManager.registerPeriodicSync.bind(backgroundSyncManager),
  };
}

// Add React import for the hook
import React from 'react';
