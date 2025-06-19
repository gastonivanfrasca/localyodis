import { ActionTypes } from "../context/main";
import { ActiveIndicator } from "./ActiveIndicator";
import { ListFilter } from "lucide-react";
import { Navigations } from "../types/navigation";
import { useMainContext } from "../context/main";

export const FilterSourcesButton = () => {
  const { state, dispatch } = useMainContext();
  
  const hasActiveFilters = state.activeSources.length !== state.sources.length;

  if (state.navigation === Navigations.FILTER_SOURCES) {
    return (
      <div className="relative">
        <button
          className="cursor-pointer"
          onClick={() => {
            dispatch({
              type: ActionTypes.SET_NAVIGATION,
              payload: Navigations.HOME,
            });
          }}
        >
          <ListFilter style={{ color: "#1e7bc0" }} />
        </button>
        <ActiveIndicator isActive={hasActiveFilters} color="bg-green-500" />
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => {
          dispatch({
            type: ActionTypes.SET_NAVIGATION,
            payload: Navigations.FILTER_SOURCES,
          });
        }}
        className="cursor-pointer"
      >
        <ListFilter className="text-gray-800 dark:text-gray-400" />
      </button>
      <ActiveIndicator isActive={hasActiveFilters} color="bg-green-500" />
    </div>
  );
};
