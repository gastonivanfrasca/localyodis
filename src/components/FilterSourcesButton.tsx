import { ListFilter } from "lucide-react";
import { Navigations } from "../types/navigation";
import { useMainContext } from "../context/main";

export const FilterSourcesButton = () => {
  const { state, dispatch } = useMainContext();

  if (state.navigation === Navigations.FILTER_SOURCES) {
    return (
      <button
        className="cursor-pointer"
        onClick={() => {
          dispatch({
            type: "SET_NAVIGATION",
            payload: Navigations.HOME,
          });
        }}
      >
        <ListFilter style={{ color: "#1e7bc0" }} />
      </button>
    );
  }

  return (
    <button
      onClick={() => {
        dispatch({
          type: "SET_NAVIGATION",
          payload: Navigations.FILTER_SOURCES,
        });
      }}
      className="cursor-pointer"
    >
      <ListFilter className="text-gray-800 dark:text-gray-400" />
    </button>
  );
};
