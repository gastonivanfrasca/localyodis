import { ArrowLeft, Bookmark, Clock, Compass, Home, Menu, Search } from 'lucide-react';
import { HomeButtonModes, Navigations } from '../../types/navigation';
import { Link, useLocation } from 'react-router';

import { ActionTypes } from '../../context/main';
import { ActiveIndicator } from '../ActiveIndicator';
import { SidebarButton } from './SidebarButton';
import { useMainContext } from '../../context/main';

// Home Button for Sidebar
export const SidebarHomeButton = ({ mode }: { mode: HomeButtonModes }) => {
  const { state, dispatch } = useMainContext();
  const navigation = state.navigation;
  const isActive = navigation === Navigations.HOME;

  const handleOnClick = () => {
    dispatch({
      type: ActionTypes.SET_NAVIGATION,
      payload: Navigations.HOME,
    });
  };

  if (mode === HomeButtonModes.LINK) {
    return (
      <Link to="/" onClick={handleOnClick}>
        <SidebarButton
          icon={<Home size={20} />}
          label="Home"
          isActive={isActive}
        />
      </Link>
    );
  }

  return (
    <SidebarButton
      icon={<Home size={20} />}
      label="Home"
      isActive={isActive}
      onClick={handleOnClick}
    />
  );
};

// Search Button for Sidebar
export const SidebarSearchButton = () => {
  const { state, dispatch } = useMainContext();
  const hasActiveSearch = state.searchQuery && state.searchQuery.trim() !== '';
  const isActive = state.navigation === Navigations.SEARCH;

  const handleClick = () => {
    if (isActive) {
      dispatch({
        type: ActionTypes.SET_NAVIGATION,   
        payload: Navigations.HOME,
      });
      dispatch({
        type: ActionTypes.SET_SEARCH_QUERY,
        payload: null,
      });
    } else {
      dispatch({
        type: ActionTypes.SET_NAVIGATION,
        payload: Navigations.SEARCH,
      });
    }
  };

  return (
    <SidebarButton
      icon={<Search size={20} />}
      label="Search"
      isActive={isActive}
      onClick={handleClick}
    >
      <ActiveIndicator isActive={!!hasActiveSearch} />
    </SidebarButton>
  );
};



// Bookmarks Button for Sidebar
export const SidebarBookmarksButton = () => {
  const { dispatch } = useMainContext();
  
  const handleClick = () => {
    dispatch({
      type: ActionTypes.SET_NAVIGATION,
      payload: Navigations.BOOKMARKEDS,
    });
  };

  return (
    <SidebarButton
      icon={<Bookmark size={20} />}
      label="Bookmarks"
      onClick={handleClick}
    />
  );
};

// Menu Button for Sidebar
export const SidebarMenuButton = () => {
  const { dispatch } = useMainContext();

  const handleClick = () => {
    dispatch({
      type: ActionTypes.SET_NAVIGATION,
      payload: Navigations.SETTINGS,
    });
  };

  return (
    <Link to="/menu">
      <SidebarButton
        icon={<Menu size={20} />}
        label="Menu"
        onClick={handleClick}
      />
    </Link>
  );
};

// Back Button for Sidebar
export const SidebarBackButton = () => {
  return (
    <SidebarButton
      icon={<ArrowLeft size={20} />}
      label="Back"
    />
  );
};

// Discover Button for Sidebar
export const SidebarDiscoverButton = () => {
  const location = useLocation();
  const { dispatch } = useMainContext();
  const isActive = location.pathname === "/discover";

  const handleClick = () => {
    dispatch({
      type: ActionTypes.SET_NAVIGATION,
      payload: Navigations.DISCOVER,
    });
  };

  return (
    <Link to="/discover" onClick={handleClick}>
      <SidebarButton
        icon={<Compass size={20} />}
        label="Discover"
        isActive={isActive}
      />
    </Link>
  );
};

// History Button for Sidebar
export const SidebarHistoryButton = () => {
  const location = useLocation();
  const { dispatch } = useMainContext();
  const isActive = location.pathname === "/history";

  const handleClick = () => {
    dispatch({
      type: ActionTypes.SET_NAVIGATION,
      payload: Navigations.HISTORY,
    });
  };

  return (
    <Link to="/history" onClick={handleClick}>
      <SidebarButton
        icon={<Clock size={20} />}
        label="History"
        isActive={isActive}
      />
    </Link>
  );
}; 