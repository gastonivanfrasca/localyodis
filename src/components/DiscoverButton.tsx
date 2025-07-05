import { ActionTypes } from "../context/main";
import { Navigations } from "../types/navigation";
import { Compass } from "lucide-react";
import { useMainContext } from "../context/main";

export const DiscoverButton = () => {
  const { state, dispatch } = useMainContext();
  const navigation = state.navigation;

  const isActive = navigation === Navigations.DISCOVER;
  const activeClasses = isActive
    ? "text-[#1e7bc0]"
    : "text-gray-800 dark:text-gray-400";

  const handleOnClick = () => {
    dispatch({
      type: ActionTypes.SET_NAVIGATION,
      payload: Navigations.DISCOVER,
    });
  };

  return (
    <button onClick={handleOnClick}>
      <Compass className={`cursor-pointer ${activeClasses}`} />
    </button>
  );
}; 