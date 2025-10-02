import { ConfirmationModal } from "../../components/ConfirmationModal";
import { Check, Languages, RotateCcw } from "lucide-react";
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
