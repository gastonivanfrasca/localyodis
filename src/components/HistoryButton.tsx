import { ActionTypes } from "../context/main";
import { Clock } from "lucide-react";
import { Navigations } from "../types/navigation";
import { useMainContext } from "../context/main";

export const HistoryButton = () => {
  const { state, dispatch } = useMainContext();
  const navigation = state.navigation;

  if (navigation === Navigations.HISTORY) {
    return (
      <button
        className="cursor-pointer"
        onClick={() => {
          dispatch({
            type: ActionTypes.SET_NAVIGATION,
            payload: Navigations.HOME,
          });
        }}
      >
        <Clock style={{ color: "#1e7bc0" }} />
      </button>
    );
  }

  return (
    <button
      onClick={() => {
        dispatch({
          type: ActionTypes.SET_NAVIGATION,
          payload: Navigations.HISTORY,
        });
      }}
      className="cursor-pointer"
    >
      <Clock className="text-gray-800 dark:text-gray-400" />
    </button>
  );
}; 