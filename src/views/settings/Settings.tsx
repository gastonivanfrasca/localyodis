import { ConfirmationModal } from "../../components/ConfirmationModal";
import { NavigationTitleWithBack } from "../../components/v2/NavigationTitleWithBack";
import { useI18n } from "../../context/i18n";
import { useState } from "react";

export const Settings = () => {
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const { t, language, setLanguage, languages } = useI18n();

  const handleResetConfiguration = () => {
    // Clear all localStorage data
    localStorage.removeItem("localyodis");
    
    // Reload the page to reset the app state
    window.location.reload();
  };

  const handleLanguageChange = (languageCode: string) => {
    setLanguage(languageCode as typeof language);
  };

  return (
    <div className="min-h-dvh bg-white dark:bg-slate-950 text-black dark:text-white font-sans flex flex-col">
      <NavigationTitleWithBack label={t('settings.title')} />
      
      {/* Main Content Container - Centered on Desktop */}
      <div className="flex-1 flex justify-center">
        <div className="w-full max-w-2xl px-6 mt-16 flex flex-col gap-5 py-6">
          
          {/* Language Selection */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
              {t('settings.language')}
            </h3>
            <p className="text-blue-700 dark:text-blue-300 text-sm mb-4">
              {t('settings.language.description')}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition ${
                    language === lang.code
                      ? 'bg-blue-100 dark:bg-blue-900/50 border-blue-300 dark:border-blue-600 text-blue-900 dark:text-blue-100'
                      : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <div className="text-left">
                    <div className="font-medium">{lang.nativeName}</div>
                    <div className="text-sm opacity-75">{lang.name}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Reset Configuration Button */}
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">
              {t('settings.reset.title')}
            </h3>
            <p className="text-red-700 dark:text-red-300 text-sm mb-4">
              {t('settings.reset.description')}
            </p>
            <button
              onClick={() => setIsResetModalOpen(true)}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 px-6 rounded-xl transition text-sm tracking-tight"
            >
              {t('settings.reset')}
            </button>
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