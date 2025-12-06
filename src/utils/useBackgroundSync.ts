// Hook para inicializar y manejar Background Sync
import { useEffect } from "react";
import { useMainContext } from "../context/main";
import { registerPeriodicSync, sendStorageDataToSW, isPeriodicSyncSupported } from "../utils/backgroundSync";

export const useBackgroundSync = () => {
  const { state } = useMainContext();

  useEffect(() => {
    // Solo inicializar si hay soporte para Periodic Background Sync
    if (!isPeriodicSyncSupported()) {
      return;
    }

    const initializeBackgroundSync = async () => {
      const hasNotificationsEnabled = state.sources.some(s => s.notificationsEnabled);
      
      if (hasNotificationsEnabled) {
        // Registrar periodic sync
        await registerPeriodicSync();
        
        // Enviar datos actuales al service worker
        await sendStorageDataToSW({
          sources: state.sources,
          items: state.items,
          activeSources: state.activeSources,
        });
      }
    };

    initializeBackgroundSync();
  }, [state.sources, state.items, state.activeSources]);
};






