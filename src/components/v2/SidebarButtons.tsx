import { ArrowLeft, Bookmark, Clock, Compass, Home, Menu, Search } from 'lucide-react';
import { HomeButtonModes, Navigations } from '../../types/navigation';
import { Link, useLocation } from 'react-router';

import { ActionTypes } from '../../context/main';
import { ActiveIndicator } from '../ActiveIndicator';
import { SidebarButton } from './SidebarButton';
import { useMainContext } from '../../context/main';
import { useI18n } from '../../context/i18n';

// Home Button for Sidebar
export const SidebarHomeButton = ({ mode }: { mode: HomeButtonModes }) => {
  const { state, dispatch } = useMainContext();
  const { t } = useI18n();
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
          label={t('home')}
          isActive={isActive}
        />
      </Link>
    );
  }

  return (
    <SidebarButton
      icon={<Home size={20} />}
      label={t('home')}
      isActive={isActive}
      onClick={handleOnClick}
    />
  );
};

// Search Button for Sidebar
export const SidebarSearchButton = () => {
  const { state, dispatch } = useMainContext();
  const { t } = useI18n();
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
      label={t('search')}
      isActive={isActive}
      onClick={handleClick}
    >
      <ActiveIndicator isActive={!!hasActiveSearch} />
    </SidebarButton>
  );
};



// Bookmarks Button for Sidebar
export const SidebarBookmarksButton = () => {
  const { state, dispatch } = useMainContext();
  const { t } = useI18n();
  const isActive = state.navigation === Navigations.BOOKMARKEDS;
  
  const handleClick = () => {
    dispatch({
      type: ActionTypes.SET_NAVIGATION,
      payload: Navigations.BOOKMARKEDS,
    });
  };

  return (
    <SidebarButton
      icon={<Bookmark size={20} />}
      label={t('bookmarks')}
      isActive={isActive}
      onClick={handleClick}
    />
  );
};

// History Button for Sidebar
export const SidebarHistoryButton = () => {
  const { state, dispatch } = useMainContext();
  const { t } = useI18n();
  const isActive = state.navigation === Navigations.HISTORY;
  
  const handleClick = () => {
    dispatch({
      type: ActionTypes.SET_NAVIGATION,
      payload: Navigations.HISTORY,
    });
  };

  return (
    <SidebarButton
      icon={<Clock size={20} />}
      label={t('history')}
      isActive={isActive}
      onClick={handleClick}
    />
  );
};

// Menu Button for Sidebar
export const SidebarMenuButton = () => {
  const { dispatch } = useMainContext();
  const { t } = useI18n();

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
        label={t('menu')}
        onClick={handleClick}
      />
    </Link>
  );
};

// Back Button for Sidebar
export const SidebarBackButton = () => {
  const { t } = useI18n();
  return (
    <SidebarButton
      icon={<ArrowLeft size={20} />}
      label={t('common.back')}
    />
  );
};

// Discover Button for Sidebar
export const SidebarDiscoverButton = () => {
  const location = useLocation();
  const { dispatch } = useMainContext();
  const { t } = useI18n();
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
        label={t('discover')}
        isActive={isActive}
      />
    </Link>
  );
};

 