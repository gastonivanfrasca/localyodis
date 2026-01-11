import { CircleHelp, Hand, MousePointerClick, X } from "lucide-react";
import { useState } from "react";

import { useI18n } from "../context/i18n";

export const NavHelpButton = () => {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  const closeSheet = () => setIsOpen(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={t('help.nav.iconLabel')}
        title={t('help.nav.iconLabel')}
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
                  {t('help.nav.title')}
                </h2>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                  {t('help.nav.description')}
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

            <div className="mt-5 space-y-4 text-sm text-zinc-700 dark:text-zinc-300">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  {t('help.nav.buttonsTitle')}
                </p>
                <ul className="mt-2 space-y-2">
                  <li className="flex items-start gap-2">
                    <MousePointerClick className="mt-0.5 h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                    <span>{t('help.nav.buttons.homeAction')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <MousePointerClick className="mt-0.5 h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                    <span>{t('help.nav.buttons.bookmarks')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <MousePointerClick className="mt-0.5 h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                    <span>{t('help.nav.buttons.help')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <MousePointerClick className="mt-0.5 h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                    <span>{t('help.nav.buttons.search')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <MousePointerClick className="mt-0.5 h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                    <span>{t('help.nav.buttons.discover')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <MousePointerClick className="mt-0.5 h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                    <span>{t('help.nav.buttons.menu')}</span>
                  </li>
                </ul>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  {t('help.nav.gesturesTitle')}
                </p>
                <ul className="mt-2 space-y-2">
                  <li className="flex items-start gap-2">
                    <Hand className="mt-0.5 h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                    <span>{t('help.nav.gestures.hideItem')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Hand className="mt-0.5 h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                    <span>{t('help.nav.gestures.hideAll')}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
