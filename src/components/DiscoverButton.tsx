import { Link, useLocation } from "react-router";

import { ActionTypes } from "../context/main";
import { Compass } from "lucide-react";
import { Navigations } from "../types/navigation";
import { useMainContext } from "../context/main";

export const DiscoverButton = () => {
  const location = useLocation();
  const { dispatch } = useMainContext();
  const isActive = location.pathname === "/discover";
  const activeClasses = isActive
    ? "text-[#1e7bc0]"
    : "text-gray-800 dark:text-gray-400";

  const handleClick = () => {
    dispatch({
      type: ActionTypes.SET_NAVIGATION,
      payload: Navigations.DISCOVER,
    });
  };

  return (
    <Link to="/discover" onClick={handleClick}>
      <Compass className={`cursor-pointer ${activeClasses}`} />
    </Link>
  );
}; 