import { ActionTypes, useMainContext } from "../../context/main";

import { ChevronDown } from "lucide-react";
import { Navigations } from "../../types/navigation";
import { getRSSItemStrProp } from "../../utils/rss";
import { useEffect } from "react";

export const SearchInput = () => {
  const { state, dispatch } = useMainContext();

  useEffect(() => {
    if (state.searchQuery) {
        if (state.searchQuery.length < 1) {
            dispatch({
                type: ActionTypes.SET_ACTIVE_ITEMS,
                payload: state.items,
            });
            return;
        }
      const filteredItems = state.items?.filter((item) => {
        const title = getRSSItemStrProp(item, "title");
        
        return title?.toLowerCase().includes(state.searchQuery?.toLowerCase() ?? "");
      });

      dispatch({
        type: ActionTypes.SET_ACTIVE_ITEMS,
        payload: filteredItems, 
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
  };

  return (
    <div className="w-full sticky bottom-16 left-0 right-0 z-10 bg-white dark:bg-slate-900 p-2 flex justify-between items-center gap-4 shadow-lg">
      <input
        type="text"
        placeholder="Search"
        className="w-full text-lg focus:outline-none dark:text-white px-4 py-2"
        onChange={handleSearch}
        value={state.searchQuery ?? ""}
      />
      <button onClick={handleClearSearch}>
        <ChevronDown className="w-6 h-6 dark:text-white" />
      </button>
    </div>
  );
};
