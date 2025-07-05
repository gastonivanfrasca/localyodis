import { ArrowLeft, Bookmark, Compass, Home, ListFilter, Search, Settings } from 'lucide-react';
import { HomeButtonModes, Navigations } from '../../types/navigation';

import { ActionTypes } from '../../context/main';
import { ActiveIndicator } from '../ActiveIndicator';
import { Link } from 'react-router';
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

// Filter Button for Sidebar
export const SidebarFilterButton = () => {
  const { state, dispatch } = useMainContext();
  const hasActiveFilters = state.activeSources.length !== state.sources.length;
  const isActive = state.navigation === Navigations.FILTER_SOURCES;

  const handleClick = () => {
    if (isActive) {
      dispatch({
        type: ActionTypes.SET_NAVIGATION,
        payload: Navigations.HOME,
      });
    } else {
      dispatch({
        type: ActionTypes.SET_NAVIGATION,
        payload: Navigations.FILTER_SOURCES,
      });
    }
  };

  return (
    <SidebarButton
      icon={<ListFilter size={20} />}
      label="Filter Sources"
      isActive={isActive}
      onClick={handleClick}
    >
      <ActiveIndicator isActive={hasActiveFilters} color="bg-green-500" />
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

// Settings Button for Sidebar
export const SidebarSettingsButton = () => {
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
        icon={<Settings size={20} />}
        label="Settings"
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
  const { state, dispatch } = useMainContext();
  const isActive = state.navigation === Navigations.DISCOVER;

  const handleClick = () => {
    dispatch({
      type: ActionTypes.SET_NAVIGATION,
      payload: Navigations.DISCOVER,
    });
  };

  return (
    <SidebarButton
      icon={<Compass size={20} />}
      label="Discover"
      isActive={isActive}
      onClick={handleClick}
    />
  );
}; 