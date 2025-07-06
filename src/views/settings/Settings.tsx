import { cleanupStorageData, getLocallyStoredData, getStorageInfo, storeDataLocally } from "../../utils/storage";
import { useEffect, useState } from "react";

import { ConfirmationModal } from "../../components/ConfirmationModal";
import { NavigationTitleWithBack } from "../../components/v2/NavigationTitleWithBack";

export const Settings = () => {
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isCleanupModalOpen, setIsCleanupModalOpen] = useState(false);
  const [storageInfo, setStorageInfo] = useState<ReturnType<typeof getStorageInfo>>(null);

  useEffect(() => {
    const info = getStorageInfo();
    setStorageInfo(info);
  }, []);

  const handleResetConfiguration = () => {
    // Clear all localStorage data
    localStorage.removeItem("localyodis");
    
    // Reload the page to reset the app state
    window.location.reload();
  };

  const handleCleanupStorage = () => {
    try {
      const currentData = getLocallyStoredData();
      const cleanedData = cleanupStorageData(currentData);
      storeDataLocally(cleanedData);
      
      // Update storage info after cleanup
      const newInfo = getStorageInfo();
      setStorageInfo(newInfo);
      
      alert('Datos limpiados exitosamente');
      setIsCleanupModalOpen(false);
    } catch (error) {
      console.error('Error cleaning up storage:', error);
      alert('Error al limpiar los datos');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-black dark:text-white font-sans flex flex-col">
      <NavigationTitleWithBack label="Settings" />
      
      {/* Main Content Container - Centered on Desktop */}
      <div className="flex-1 flex justify-center">
        <div className="w-full max-w-2xl px-6 mt-16 flex flex-col gap-5 py-6">
          
          {/* Storage Information */}
          {storageInfo && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
                Información de Almacenamiento
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700 dark:text-blue-300">Total de artículos:</span>
                  <span className="font-medium text-blue-900 dark:text-blue-100">
                    {storageInfo.totalItems}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700 dark:text-blue-300">Bookmarks:</span>
                  <span className="font-medium text-blue-900 dark:text-blue-100">
                    {storageInfo.totalBookmarks}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700 dark:text-blue-300">Fuentes RSS:</span>
                  <span className="font-medium text-blue-900 dark:text-blue-100">
                    {storageInfo.totalSources}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700 dark:text-blue-300">Tamaño del almacenamiento:</span>
                  <span className="font-medium text-blue-900 dark:text-blue-100">
                    {storageInfo.sizeInMB > 1 ? `${storageInfo.sizeInMB} MB` : `${storageInfo.sizeInKB} KB`}
                  </span>
                </div>
              </div>
              
              {/* Cleanup Button */}
              <button
                onClick={() => setIsCleanupModalOpen(true)}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-xl transition text-sm tracking-tight"
              >
                Limpiar Datos Antiguos
              </button>
            </div>
          )}

          {/* Reset Configuration Button */}
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">
              Reset Configuration
            </h3>
            <p className="text-red-700 dark:text-red-300 text-sm mb-4">
              This will permanently delete all your sources, bookmarks, and settings. This action cannot be undone.
            </p>
            <button
              onClick={() => setIsResetModalOpen(true)}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 px-6 rounded-xl transition text-sm tracking-tight"
            >
              Reset Configuration
            </button>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      <ConfirmationModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleResetConfiguration}
        title="Reset Configuration"
        message="Are you sure you want to reset all configuration? This will delete all your sources, bookmarks, and settings."
        confirmButtonText="Reset"
        cancelButtonText="Cancel"
        isDestructive={true}
      />
      
      {/* Cleanup Confirmation Modal */}
      <ConfirmationModal
        isOpen={isCleanupModalOpen}
        onClose={() => setIsCleanupModalOpen(false)}
        onConfirm={handleCleanupStorage}
        title="Limpiar Datos Antiguos"
        message="Esto eliminará artículos RSS antiguos para liberar espacio. Solo se mantendrán los artículos más recientes."
        confirmButtonText="Limpiar"
        cancelButtonText="Cancelar"
      />
    </div>
  );
}; 