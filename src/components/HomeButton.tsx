import { ActionTypes, useMainContext } from "../context/main";
import { HomeButtonModes, Navigations } from "../types/navigation";
import { useLocation, useNavigate } from "react-router";

import { Home } from "lucide-react";

export interface HomeButtonProps {
  mode: HomeButtonModes;
}

export const HomeButton = (props: HomeButtonProps) => {
  const { mode } = props;
  const { state, dispatch } = useMainContext();
  const location = useLocation();
  const navigate = useNavigate();

  // Only active when on home page and in default state
  const isActive = location.pathname === "/" && state.navigation === null;
  const activeClasses = isActive
    ? "text-[#1e7bc0]"
    : "text-gray-800 dark:text-gray-400";

  const handleHomeClick = () => {
    // If not on home page, navigate to home
    if (location.pathname !== "/") {
      navigate("/");
      return;
    }

    // If we're in bookmarks, history, or search mode, go to general feed
    if (state.navigation !== null) {
      dispatch({
        type: ActionTypes.SET_NAVIGATION,
        payload: null,
      });
      
      // Clear search query if we were in search mode
      if (state.navigation === Navigations.SEARCH) {
        dispatch({
          type: ActionTypes.SET_SEARCH_QUERY,
          payload: null,
        });
      }
      return;
    }

    // If we're already in general feed, just scroll to top (no refresh)
    const pubsListElement = document.getElementById("pubs-list");
    if (pubsListElement) {
      pubsListElement.scrollTop = 0;
    }

    // Reset scroll position in state
    dispatch({
      type: ActionTypes.SET_SCROLL_POSITION,
      payload: 0,
    });
  };

  if (mode === HomeButtonModes.LINK) {
    // For link mode, if not on home page, navigate normally
    if (location.pathname !== "/") {
      return (
        <button onClick={() => navigate("/")}>
          <Home className={`cursor-pointer ${activeClasses}`} />
        </button>
      );
    }
    
    // If on home page, use the smart home behavior
    return (
      <button onClick={handleHomeClick}>
        <Home className={`cursor-pointer ${activeClasses}`} />
      </button>
    );
  }

  return (
    <button onClick={handleHomeClick}>
      <Home className={`cursor-pointer ${activeClasses}`} />
    </button>
  );
};
