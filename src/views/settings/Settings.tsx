import { ConfirmationModal } from "../../components/ConfirmationModal";
import { Globe2, RotateCcw } from "lucide-react";
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
        <div className="w-full max-w-2xl px-6 mt-16 flex flex-col gap-6 py-10">

          {/* Language Selection */}
          <div className="bg-zinc-100 dark:bg-slate-900 border border-zinc-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-zinc-200 dark:border-slate-800 text-zinc-700 dark:text-zinc-300">
                <Globe2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-1">
                  {t('settings.language')}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {t('settings.language.description')}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`flex items-start gap-3 p-4 rounded-xl border transition text-left shadow-sm ${
                    language === lang.code
                      ? 'bg-zinc-900 text-white dark:bg-zinc-200 dark:text-zinc-900 border-transparent'
                      : 'bg-white dark:bg-slate-950 border-zinc-200 dark:border-slate-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-slate-700'
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
          <div className="bg-zinc-100 dark:bg-slate-900 border border-zinc-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-zinc-200 dark:border-slate-800 text-red-500">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-1">
                  {t('settings.reset.title')}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {t('settings.reset.description')}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsResetModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 px-6 rounded-xl transition text-sm tracking-tight"
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