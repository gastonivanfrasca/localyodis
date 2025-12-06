import { useCallback, useEffect, useState } from "react";

export type NotificationPermission = "default" | "granted" | "denied";

interface UseNotificationsReturn {
  permission: NotificationPermission;
  isSupported: boolean;
  requestPermission: () => Promise<boolean>;
  sendNotification: (title: string, options?: NotificationOptions) => void;
}

export const useNotifications = (): UseNotificationsReturn => {
  const [permission, setPermission] = useState<NotificationPermission>("default");

  const isSupported = typeof window !== "undefined" && "Notification" in window;

  // Check current permission status and sync with browser permission
  useEffect(() => {
    if (!isSupported) return;

    // Always sync with the actual browser permission status
    const currentPermission = Notification.permission as NotificationPermission;
    setPermission(currentPermission);
  }, [isSupported]);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      return false;
    }

    if (Notification.permission === "granted") {
      setPermission("granted");
      return true;
    }

    if (Notification.permission === "denied") {
      setPermission("denied");
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result as NotificationPermission);
      return result === "granted";
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      return false;
    }
  }, [isSupported]);

  const sendNotification = useCallback(
    (title: string, options?: NotificationOptions) => {
      console.log('[useNotifications] Intentando enviar notificación:', { title, permission: Notification.permission, isSupported });
      
      if (!isSupported) {
        console.warn('[useNotifications] Notificaciones no soportadas');
        return;
      }
      
      if (Notification.permission !== "granted") {
        console.warn('[useNotifications] Permisos no otorgados:', Notification.permission);
        return;
      }

      try {
        console.log('[useNotifications] Creando notificación con opciones:', options);
        
        // Usar rutas absolutas que funcionen en producción
        const iconPath = typeof window !== 'undefined' 
          ? window.location.origin + '/pwa-192x192.png'
          : '/pwa-192x192.png';
        const badgePath = typeof window !== 'undefined'
          ? window.location.origin + '/pwa-192x192.png'
          : '/pwa-192x192.png';
        
        const notification = new Notification(title, {
          icon: iconPath,
          badge: badgePath,
          requireInteraction: false,
          ...options,
        });

        console.log('[useNotifications] Notificación creada exitosamente:', notification);

        // Auto-close after 5 seconds
        setTimeout(() => {
          notification.close();
        }, 5000);

        // Handle click
        notification.onclick = () => {
          window.focus();
          notification.close();
        };
      } catch (error) {
        console.error("[useNotifications] Error sending notification:", error);
      }
    },
    [isSupported]
  );

  return {
    permission,
    isSupported,
    requestPermission,
    sendNotification,
  };
};

