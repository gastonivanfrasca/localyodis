import { ConfirmationModal } from "../../components/ConfirmationModal";
import { RotateCcw } from "lucide-react";
import { NavigationTitleWithBack } from "../../components/v2/NavigationTitleWithBack";
import { useI18n } from "../../context/i18n";
import { useState } from "react";
import { MenuItem } from "../../components/v2/MenuItem";
import { DestructiveMenuItem } from "../../components/v2/DestructiveMenuItem";

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
        <NavigationTitleWithBack label={t("settings.title")} />

        {/* Main Content Container - Centered on Desktop */}
        <div className="flex-1 flex justify-center bg-white dark:bg-slate-950">
          <div className="w-full max-w-2xl px-8 mt-20 md:mt-16 flex flex-col gap-8 pb-24">
            {/* Language Selection */}
            <div className="flex flex-col gap-2">
              <p className="text-sm text-zinc-600 dark:text-zinc-400 px-4">
                {t("settings.language.description")}
              </p>
              {languages.map((lang) => (
                <MenuItem
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  icon={
                    <div className="font-semibold text-sm w-6 h-6 flex items-center justify-center">
                      {lang.code.toUpperCase()}
                    </div>
                  }
                  label={lang.nativeName}
                  chevron={language !== lang.code}
                  selected={language === lang.code}
                />
              ))}
            </div>

            {/* Reset Configuration */}
            <div className="flex flex-col gap-2">
              <p className="text-sm text-red-700/90 dark:text-red-200/80 px-4">
                {t("settings.reset.description")}
              </p>
              <DestructiveMenuItem
                icon={<RotateCcw className="w-5 h-5" />}
                label={t("settings.reset")}
                onClick={() => setIsResetModalOpen(true)}
                chevron={false}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      <ConfirmationModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleResetConfiguration}
        title={t("settings.reset.modal.title")}
        message={t("settings.reset.modal.message")}
        confirmButtonText={t("settings.reset.confirm")}
        cancelButtonText={t("settings.reset.cancel")}
        isDestructive={true}
      />
    </div>
  );
};
