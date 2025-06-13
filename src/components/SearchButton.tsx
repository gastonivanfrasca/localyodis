import { ActionTypes, useMainContext } from "../context/main";

import { Navigations } from "../types/navigation";
import { Search } from "lucide-react";

export const SearchButton = () => {
  const { state, dispatch } = useMainContext();

  if (state.navigation === Navigations.SEARCH) {
    return (
      <button
        className="cursor-pointer"
        onClick={() => {
          dispatch({
            type: ActionTypes.SET_NAVIGATION,   
            payload: Navigations.HOME,
          });
          dispatch({
            type: ActionTypes.SET_SEARCH_QUERY,
            payload: null,
          });
        }}
      >
        <Search style={{ color: "#1e7bc0" }} />
      </button>
    );
  }

  return (
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
  );
}; 