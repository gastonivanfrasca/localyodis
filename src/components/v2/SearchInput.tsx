import { ActionTypes, useMainContext } from "../../context/main";

import { X } from "lucide-react";
import { getRSSItemStrProp } from "../../utils/rss";
import { useEffect } from "react";
import { useI18n } from "../../context/i18n";

export const SearchInput = () => {
  const { state, dispatch } = useMainContext();
  const { t } = useI18n();

  useEffect(() => {
    if (state.searchQuery !== null) {
      if (state.searchQuery.length < 1) {
        dispatch({
          type: ActionTypes.SET_ACTIVE_ITEMS,
          payload: state.items,
        });
        return;
      }
      const filteredItems = state.items?.filter((item) => {
        const title = getRSSItemStrProp(item, "title");

        return title
          ?.toLowerCase()
          .includes(state.searchQuery?.toLowerCase().trim() ?? "");
      });

      dispatch({
        type: ActionTypes.SET_ACTIVE_ITEMS,
        payload: filteredItems,
      });
    } else {
      // If no search query, show all items
      dispatch({
        type: ActionTypes.SET_ACTIVE_ITEMS,
        payload: state.items,
      });
    }
  }, [state.searchQuery, state.items]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: ActionTypes.SET_SEARCH_QUERY,
      payload: e.target.value,
    });
  };

  const handleClearSearch = () => {
    dispatch({
      type: ActionTypes.SET_NAVIGATION,
      payload: null,
    });

    dispatch({
      type: ActionTypes.SET_SEARCH_QUERY,
      payload: null,
    });

    dispatch({
      type: ActionTypes.SET_ACTIVE_ITEMS,
      payload: state.items,
    });
  };

  return (
    <div className="px-8 md:px-6 pt-6 pb-4 bg-white dark:bg-slate-950 border-b border-gray-200 dark:border-gray-700">
      <div className="relative">
        <input
          type="text"
          placeholder={t('search.placeholder')}
          value={state.searchQuery || ""}
          onChange={handleSearch}
          className="w-full p-3 pl-4 pr-10 text-lg bg-gray-100 dark:bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          autoFocus
        />
        {state.searchQuery && (
          <button
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
        )}
      </div>
    </div>
  );
};
