import { ActionTypes, useMainContext } from "../../context/main";

import { Navigations } from "../../types/navigation";
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
      payload: Navigations.HOME,
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
    <div className="w-full sticky top-0 left-0 right-0 z-10 bg-white dark:bg-slate-900 p-2 flex justify-between items-center gap-4 shadow-lg">
      <input
        type="text"
        placeholder={t('search.placeholder')}
        className="w-full text-lg focus:outline-none dark:text-white px-4 py-2 bg-white dark:bg-slate-900 placeholder-gray-500 dark:placeholder-gray-400"
        onChange={handleSearch}
        value={state.searchQuery ?? ""}
      />
      <div className="flex items-center gap-4 mr-4">
        <button onClick={handleClearSearch} className="cursor-pointer">
          <X className="w-6 h-6 dark:text-white" />
        </button>
      </div>
    </div>
  );
};
