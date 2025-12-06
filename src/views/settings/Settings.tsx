import { ConfirmationModal } from "../../components/ConfirmationModal";
import { Check, Languages, RotateCcw, Bell } from "lucide-react";
import { NavigationTitleWithBack } from "../../components/v2/NavigationTitleWithBack";
import { useI18n } from "../../context/i18n";
import { useState, useRef, useEffect } from "react";
import { useNotifications } from "../../utils/useNotifications";

export const Settings = () => {
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isTestingBackgroundSync, setIsTestingBackgroundSync] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const { t, language, setLanguage, languages } = useI18n();
  const { permission } = useNotifications();
  const testIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleResetConfiguration = () => {
    // Clear all localStorage data
    localStorage.removeItem("localyodis");
    
    // Reload the page to reset the app state
    window.location.reload();
  };

  const handleLanguageChange = (languageCode: string) => {
    setLanguage(languageCode as typeof language);
  };

  const handleTestBackgroundSync = () => {
    if (isTestingBackgroundSync) {
      // Detener el test
      if (testIntervalRef.current) {
        clearInterval(testIntervalRef.current);
        testIntervalRef.current = null;
      }
      setIsTestingBackgroundSync(false);
      setNotificationCount(0);
    } else {
      // Iniciar el test
      // Verificar permisos directamente del navegador
      const browserPermission = Notification.permission;
      console.log('[Settings] Permisos del hook:', permission);
      console.log('[Settings] Permisos del navegador:', browserPermission);
      
      if (browserPermission !== "granted") {
        alert("Por favor, otorga permisos de notificación primero");
        return;
      }
      
      console.log('[Settings] Iniciando test de background sync');
      
      setIsTestingBackgroundSync(true);
      setNotificationCount(0);
      
      // Enviar primera notificación inmediatamente
      setNotificationCount(1);
      console.log('[Settings] Enviando primera notificación...');
      
      // Usar Notification API directamente para asegurar que funcione
      try {
        // Usar rutas absolutas que funcionen en producción
        const iconPath = window.location.origin + '/pwa-192x192.png';
        const badgePath = window.location.origin + '/pwa-192x192.png';
        
        console.log('[Settings] Icon paths:', { iconPath, badgePath, origin: window.location.origin });
        
        const notification = new Notification(`Prueba de Background Sync #1`, {
          body: "Notificación de prueba enviada cada minuto",
          icon: iconPath,
          badge: badgePath,
          tag: "background-sync-test",
        });
        console.log('[Settings] Primera notificación creada:', notification);
        
        notification.onclick = () => {
          window.focus();
          notification.close();
        };
      } catch (error) {
        console.error('[Settings] Error creando primera notificación:', error);
      }
      
      // Configurar intervalo para enviar cada minuto
      testIntervalRef.current = setInterval(() => {
        setNotificationCount(prev => {
          const newCount = prev + 1;
          console.log(`[Settings] Enviando notificación #${newCount}...`);
          
          // Verificar permisos antes de cada notificación
          if (Notification.permission !== "granted") {
            console.warn(`[Settings] Permisos revocados en notificación #${newCount}`);
            return prev;
          }
          
          try {
            // Usar rutas absolutas que funcionen en producción
            const iconPath = window.location.origin + '/pwa-192x192.png';
            const badgePath = window.location.origin + '/pwa-192x192.png';
            
            const notification = new Notification(`Prueba de Background Sync #${newCount}`, {
              body: `Notificación de prueba #${newCount} - ${new Date().toLocaleTimeString()}`,
              icon: iconPath,
              badge: badgePath,
              tag: "background-sync-test",
            });
            console.log(`[Settings] Notificación #${newCount} creada:`, notification);
            
            notification.onclick = () => {
              window.focus();
              notification.close();
            };
          } catch (error) {
            console.error(`[Settings] Error creando notificación #${newCount}:`, error);
          }
          
          return newCount;
        });
      }, 60 * 1000); // 1 minuto
    }
  };

  // Limpiar intervalo al desmontar
  useEffect(() => {
    return () => {
      if (testIntervalRef.current) {
        clearInterval(testIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full min-h-dvh bg-white dark:bg-slate-950 text-black dark:text-white">
      <div className="flex flex-col min-h-dvh">
        <NavigationTitleWithBack label={t('settings.title')} />

        {/* Main Content Container - Centered on Desktop */}
        <div className="flex-1 flex justify-center bg-white dark:bg-slate-950">
          <div className="w-full max-w-2xl px-8 mt-20 md:mt-16 flex flex-col gap-8 pb-24">
            {/* Language Selection */}
            <section className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-slate-900 shadow-sm p-6 space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-zinc-100 dark:bg-slate-800 border border-zinc-200 dark:border-slate-700">
                  <Languages className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-white tracking-tight">
                    {t('settings.language')}
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {t('settings.language.description')}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`flex items-center justify-between gap-3 p-4 rounded-xl border transition-all duration-200 text-left ${
                      language === lang.code
                        ? 'bg-zinc-900 dark:bg-zinc-200 border-zinc-900 dark:border-zinc-300 text-white dark:text-zinc-900 shadow-sm shadow-zinc-900/10'
                        : 'bg-zinc-100 dark:bg-slate-800 border-zinc-200 dark:border-slate-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-semibold tracking-tight">{lang.nativeName}</div>
                      <div className="text-sm text-zinc-500 dark:text-zinc-400">{lang.name}</div>
                    </div>
                    {language === lang.code && (
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-100/20 dark:bg-zinc-900/20">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </section>

            {/* Background Sync Test */}
            <section className="rounded-2xl border border-blue-200/60 dark:border-blue-900/60 bg-blue-50/60 dark:bg-blue-950/20 p-6 space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-blue-100/80 dark:bg-blue-900/40 border border-blue-200/70 dark:border-blue-900/60">
                  <Bell className="w-5 h-5 text-blue-700 dark:text-blue-200" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 tracking-tight">
                    Probar Background Sync
                  </h3>
                  <p className="text-sm text-blue-700/90 dark:text-blue-200/80 leading-relaxed">
                    {isTestingBackgroundSync 
                      ? `Enviando notificaciones cada minuto... (${notificationCount} enviadas)`
                      : "Envía una notificación push cada minuto para probar el background sync"}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-end pt-2">
                <button
                  onClick={handleTestBackgroundSync}
                  disabled={permission !== "granted"}
                  className={`inline-flex items-center justify-center gap-2 font-semibold py-3 px-5 rounded-xl transition-all duration-200 shadow-sm ${
                    isTestingBackgroundSync
                      ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/30'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/30'
                  } ${permission !== "granted" ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Bell className="w-4 h-4" />
                  <span>{isTestingBackgroundSync ? 'Detener Prueba' : 'Iniciar Prueba'}</span>
                </button>
              </div>
            </section>

            {/* Reset Configuration */}
            <section className="rounded-2xl border border-red-200/60 dark:border-red-900/60 bg-red-50/60 dark:bg-red-950/20 p-6 space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-red-100/80 dark:bg-red-900/40 border border-red-200/70 dark:border-red-900/60">
                  <RotateCcw className="w-5 h-5 text-red-700 dark:text-red-200" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 tracking-tight">
                    {t('settings.reset.title')}
                  </h3>
                  <p className="text-sm text-red-700/90 dark:text-red-200/80 leading-relaxed">
                    {t('settings.reset.description')}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-end pt-2">
                <button
                  onClick={() => setIsResetModalOpen(true)}
                  className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-5 rounded-xl transition-all duration-200 shadow-sm shadow-red-600/30"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{t('settings.reset')}</span>
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      <ConfirmationModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleResetConfiguration}
        title={t('settings.reset.modal.title')}
        message={t('settings.reset.modal.message')}
        confirmButtonText={t('settings.reset.confirm')}
        cancelButtonText={t('settings.reset.cancel')}
        isDestructive={true}
      />
    </div>
  );
};
