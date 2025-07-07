import { ConfirmationModal } from "../../components/ConfirmationModal";
import { NavigationTitleWithBack } from "../../components/v2/NavigationTitleWithBack";
import { useState } from "react";

export const Settings = () => {
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const handleResetConfiguration = () => {
    // Clear all localStorage data
    localStorage.removeItem("localyodis");
    
    // Reload the page to reset the app state
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-black dark:text-white font-sans flex flex-col">
      <NavigationTitleWithBack label="Settings" />
      
      {/* Main Content Container - Centered on Desktop */}
      <div className="flex-1 flex justify-center">
        <div className="w-full max-w-2xl px-6 mt-16 flex flex-col gap-5 py-6">
          
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
    </div>
  );
}; 