import { Bookmark, Clock } from "lucide-react";

import { Navigations } from "../../types/navigation";
import { useMainContext } from "../../context/main";

export const SectionIndicator = () => {
  const { state } = useMainContext();
  const navigation = state.navigation;

  if (navigation === Navigations.BOOKMARKEDS) {
    return (
      <div className="flex items-center justify-center gap-2 py-4 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
        <Bookmark className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <span className="text-lg font-semibold text-blue-900 dark:text-blue-100">
          Bookmarks
        </span>
      </div>
    );
  }

  if (navigation === Navigations.HISTORY) {
    return (
      <div className="flex items-center justify-center gap-2 py-4 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800">
        <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
        <span className="text-lg font-semibold text-amber-900 dark:text-amber-100">
          History
        </span>
      </div>
    );
  }

  return null;
}; 