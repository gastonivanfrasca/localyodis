import { useEffect, useState } from "react";

import { useI18n } from "../../context/i18n";
import { useMainContext } from "../../context/main";

const DISPLAY_DURATION_MS = 6000;

export const NewItemsPill = () => {
  const { state } = useMainContext();
  const { t } = useI18n();
  const { newItemsCount, latestFetchStatus, navigation, lastUpdated } = state;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (navigation !== null) {
      setVisible(false);
      return;
    }

    if (latestFetchStatus === "idle") {
      setVisible(false);
      return;
    }

    setVisible(true);
    const timeoutId = window.setTimeout(() => setVisible(false), DISPLAY_DURATION_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [latestFetchStatus, newItemsCount, navigation, lastUpdated]);

  if (!visible || navigation !== null || latestFetchStatus === "idle") {
    return null;
  }

  const hasNewItems = latestFetchStatus === "new" && newItemsCount > 0;
  const statusLabel = hasNewItems
    ? `+${newItemsCount} ${t(newItemsCount === 1 ? "feed.newItem" : "feed.newItems")}`
    : t("feed.upToDate");
  const baseClasses = hasNewItems
    ? "bg-blue-600 hover:bg-blue-700"
    : "bg-emerald-500 hover:bg-emerald-600";

  const handleClick = () => {
    const listElement = document.getElementById("pubs-list");
    if (listElement) {
      listElement.scrollTo({ top: 0, behavior: "smooth" });
    }
    setVisible(false);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`fixed top-24 left-1/2 z-40 -translate-x-1/2 px-4 py-2 rounded-full text-sm font-medium text-white shadow-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-400 dark:focus-visible:ring-blue-300 ${baseClasses}`}
      aria-live="polite"
    >
      {statusLabel}
    </button>
  );
};
