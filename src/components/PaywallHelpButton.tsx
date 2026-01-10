import { CircleHelp, Lock, X } from "lucide-react";
import { useState } from "react";

import { useI18n } from "../context/i18n";

export const PaywallHelpButton = () => {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  const closeSheet = () => setIsOpen(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={t('help.paywall.iconLabel')}
        title={t('help.paywall.iconLabel')}
        className="flex items-center justify-center min-w-[48px]"
      >
        <CircleHelp className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col">
          <button
            type="button"
            className="flex-1 bg-black/40"
            onClick={closeSheet}
            aria-label={t('a11y.closeModal')}
          />
          <div className="bg-white dark:bg-slate-950 rounded-t-2xl p-5 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                  {t('help.paywall.title')}
                </h2>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                  {t('help.paywall.description')}
                </p>
              </div>
              <button
                type="button"
                onClick={closeSheet}
                className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-slate-800"
                aria-label={t('a11y.closeModal')}
              >
                <X className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
              </button>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              <span className="inline-flex items-center rounded-full border border-zinc-300/70 dark:border-zinc-600/70 text-zinc-600 dark:text-zinc-300 p-1">
                <Lock className="w-3 h-3" />
              </span>
              <span>{t('help.paywall.example')}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
