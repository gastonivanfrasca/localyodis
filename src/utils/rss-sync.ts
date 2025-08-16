// RSS-specific background sync integration for LocalYodis
import { backgroundSyncManager } from './background-sync';

export interface RSSSource {
  id: string;
  url: string;
  name: string;
  lastSync?: Date;
}

export class RSSBackgroundSync {
  private static instance: RSSBackgroundSync;
  
  private constructor() {
    this.initializeEventListeners();
  }

  public static getInstance(): RSSBackgroundSync {
    if (!RSSBackgroundSync.instance) {
      RSSBackgroundSync.instance = new RSSBackgroundSync();
    }
    return RSSBackgroundSync.instance;
  }

  private initializeEventListeners() {
    // Listen for network status changes
    window.addEventListener('online', () => {
      console.log('Network restored - triggering background sync');
      this.syncWhenOnline();
    });

    window.addEventListener('offline', () => {
      console.log('Network lost - will sync when restored');
    });

    // Listen for background sync operations
    window.addEventListener('process-pending-operation', (event: Event) => {
      const customEvent = event as CustomEvent;
      const operation = customEvent.detail;
      if (operation.type === 'rss-sync') {
        this.processPendingRSSSync(operation);
      }
    });
  }

  private async processPendingRSSSync(operation: { source: RSSSource; type: string }) {
    try {
      console.log('Processing pending RSS sync:', operation.source.name);
      const success = await this.syncRSSSource(operation.source);
      
      if (success) {
        // Remove from pending syncs
        this.removePendingSync(operation.source.id);
      }
    } catch (error) {
      console.error('Failed to process pending RSS sync:', error);
    }
  }

  private removePendingSync(sourceId: string) {
    try {
      const pendingSyncs = this.getPendingSyncs();
      const updated = pendingSyncs.filter(s => s.id !== sourceId);
      localStorage.setItem('pending_rss_syncs', JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to remove pending sync:', error);
    }
  }

  // Sync RSS feeds when network is restored
  private async syncWhenOnline() {
    if (navigator.onLine) {
      await backgroundSyncManager.registerBackgroundSync();
    }
  }

  // Queue RSS feed updates for background sync
  public async queueRSSUpdate(source: RSSSource) {
    try {
      // Try to sync immediately
      const success = await this.syncRSSSource(source);
      
      if (!success) {
        // If immediate sync fails, queue for background sync
        console.log(`Queueing RSS source ${source.name} for background sync`);
        await this.storeForLaterSync(source);
        
        // Queue the operation in the background sync manager
        backgroundSyncManager.queueOperation({
          type: 'rss-sync',
          source: source,
          operation: 'update'
        });
        
        await backgroundSyncManager.registerBackgroundSync();
      }
    } catch (error) {
      console.error('Failed to queue RSS update:', error);
    }
  }

  // Attempt to sync a single RSS source
  private async syncRSSSource(source: RSSSource): Promise<boolean> {
    try {
      if (!navigator.onLine) {
        return false;
      }

      console.log(`Syncing RSS source: ${source.name}`);
      
      // Replace with your actual RSS fetching logic
      const response = await fetch(source.url, {
        headers: {
          'Accept': 'application/rss+xml, application/xml, text/xml'
        }
      });

      if (response.ok) {
        const rssData = await response.text();
        await this.storeRSSData(source, rssData);
        console.log(`Successfully synced: ${source.name}`);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error(`Failed to sync RSS source ${source.name}:`, error);
      return false;
    }
  }

  // Store RSS data locally
  private async storeRSSData(source: RSSSource, data: string) {
    const storageKey = `rss_${source.id}`;
    const syncData = {
      source,
      data,
      lastSync: new Date().toISOString(),
      syncedOffline: !navigator.onLine
    };
    
    try {
      localStorage.setItem(storageKey, JSON.stringify(syncData));
      
      // Also store in IndexedDB for larger data if needed
      if ('indexedDB' in window) {
        // Implementation for IndexedDB storage would go here
      }
    } catch (error) {
      console.error('Failed to store RSS data:', error);
    }
  }

  // Store source for later sync when offline
  private async storeForLaterSync(source: RSSSource) {
    const pendingSyncs = this.getPendingSyncs();
    pendingSyncs.push({
      ...source,
      queuedAt: new Date().toISOString()
    });
    
    localStorage.setItem('pending_rss_syncs', JSON.stringify(pendingSyncs));
  }

  // Get pending syncs
  private getPendingSyncs(): (RSSSource & { queuedAt: string })[] {
    try {
      const pending = localStorage.getItem('pending_rss_syncs');
      return pending ? JSON.parse(pending) : [];
    } catch {
      return [];
    }
  }

  // Process all pending syncs (called by service worker)
  public async processPendingSyncs(): Promise<void> {
    const pendingSyncs = this.getPendingSyncs();
    
    if (pendingSyncs.length === 0) {
      return;
    }

    console.log(`Processing ${pendingSyncs.length} pending RSS syncs`);
    
    const successful: string[] = [];
    
    for (const source of pendingSyncs) {
      const success = await this.syncRSSSource(source);
      if (success) {
        successful.push(source.id);
      }
    }

    // Remove successful syncs from pending list
    const remaining = pendingSyncs.filter(s => !successful.includes(s.id));
    localStorage.setItem('pending_rss_syncs', JSON.stringify(remaining));
    
    console.log(`Completed ${successful.length} RSS syncs, ${remaining.length} remaining`);
  }

  // Enable periodic sync for regular RSS updates
  public async enablePeriodicSync(): Promise<void> {
    if (backgroundSyncManager.isPeriodicSyncSupported()) {
      await backgroundSyncManager.registerPeriodicSync();
      console.log('Periodic RSS sync enabled');
    } else {
      console.warn('Periodic sync not supported - falling back to manual refresh');
    }
  }

  // Get sync statistics
  public getSyncStats() {
    const pendingSyncs = this.getPendingSyncs();
    const capabilities = backgroundSyncManager.getSyncCapabilities();
    
    return {
      pendingSyncs: pendingSyncs.length,
      lastSync: this.getLastSyncTime(),
      capabilities,
      isOnline: navigator.onLine
    };
  }

  private getLastSyncTime(): Date | null {
    try {
      const lastSync = localStorage.getItem('last_rss_sync');
      return lastSync ? new Date(lastSync) : null;
    } catch {
      return null;
    }
  }

  // Update last sync time
  public updateLastSyncTime(): void {
    localStorage.setItem('last_rss_sync', new Date().toISOString());
  }
}

// Export singleton instance
export const rssBackgroundSync = RSSBackgroundSync.getInstance();
