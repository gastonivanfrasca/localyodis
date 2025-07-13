import { ActionTypes, useMainContext } from "../context/main";

import { ActiveIndicator } from "./ActiveIndicator";
import { Navigations } from "../types/navigation";
import { Search } from "lucide-react";

export const SearchButton = () => {
  const { state, dispatch } = useMainContext();
  
  const hasActiveSearch = state.searchQuery && state.searchQuery.trim() !== '';

  if (state.navigation === Navigations.SEARCH) {
    return (
      <div className="relative">
        <button
          className="cursor-pointer"
          onClick={() => {
            dispatch({
              type: ActionTypes.SET_NAVIGATION,   
              payload: null,
            });
            dispatch({
              type: ActionTypes.SET_SEARCH_QUERY,
              payload: null,
            });
          }}
        >
          <Search style={{ color: "#1e7bc0" }} />
        </button>
        <ActiveIndicator isActive={!!hasActiveSearch} />
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => {
          dispatch({
            type: ActionTypes.SET_NAVIGATION,
            payload: Navigations.SEARCH,
          });
        }}
        className="cursor-pointer"
      >
        <Search className="text-gray-800 dark:text-gray-400" />
      </button>
      <ActiveIndicator isActive={!!hasActiveSearch} />
    </div>
  );
}; 