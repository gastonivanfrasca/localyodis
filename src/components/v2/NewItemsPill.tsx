import { useMemo } from "react";

import { useI18n } from "../../context/i18n";
import { useMainContext } from "../../context/main";

export const NewItemsPill = () => {
  const { state } = useMainContext();
  const { t } = useI18n();

  if (state.navigation !== null || state.loading) {
    return null;
  }

  const hasNewItems = state.newItemsCount > 0;

  const label = useMemo(() => {
    if (hasNewItems) {
      return t("feed.newItems").replace("{count}", state.newItemsCount.toString());
    }

    return t("feed.upToDate");
  }, [hasNewItems, state.newItemsCount, t]);

  const pillClasses = hasNewItems
    ? "bg-blue-600 text-white shadow-blue-200/60 dark:shadow-blue-900/40"
    : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200 shadow-emerald-200/40 dark:shadow-emerald-900/30";

  return (
    <div className="sticky top-4 z-20 flex w-full justify-center px-4">
      <div
        className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium shadow-md transition-colors duration-200 ${pillClasses}`}
        role="status"
        aria-live="polite"
      >
        {label}
      </div>
    </div>
  );
};
