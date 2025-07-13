import { ArrowLeft, Bookmark, Clock, Compass, Home, Menu, Search } from 'lucide-react';
import { HomeButtonModes, Navigations } from '../../types/navigation';
import { Link, useLocation } from 'react-router';

import { ActionTypes } from '../../context/main';
import { ActiveIndicator } from '../ActiveIndicator';
import { SidebarButton } from './SidebarButton';
import { useI18n } from '../../context/i18n';
import { useMainContext } from '../../context/main';

// Home Button for Sidebar
export const SidebarHomeButton = ({ mode }: { mode: HomeButtonModes }) => {
  const { t } = useI18n();
  const location = useLocation();
  const isActive = location.pathname === "/";

  if (mode === HomeButtonModes.LINK) {
    return (
      <Link to="/">
        <SidebarButton
          icon={<Home size={20} />}
          label={t('home')}
          isActive={isActive}
        />
      </Link>
    );
  }

  return (
    <Link to="/">
      <SidebarButton
        icon={<Home size={20} />}
        label={t('home')}
        isActive={isActive}
      />
    </Link>
  );
};

// Bookmarks Button for Sidebar
export const SidebarBookmarksButton = () => {
  const { state, dispatch } = useMainContext();
  const { t } = useI18n();
  const isActive = state.navigation === Navigations.BOOKMARKEDS;
  
  const handleClick = () => {
    if (isActive) {
      dispatch({
        type: ActionTypes.SET_NAVIGATION,
        payload: null,
      });
    } else {
      dispatch({
        type: ActionTypes.SET_NAVIGATION,
        payload: Navigations.BOOKMARKEDS,
      });
    }
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

// Search Button for Sidebar
export const SidebarSearchButton = () => {
  const { state, dispatch } = useMainContext();
  const { t } = useI18n();
  const isActive = state.navigation === Navigations.SEARCH;
  
  const handleClick = () => {
    if (isActive) {
      dispatch({
        type: ActionTypes.SET_NAVIGATION,
        payload: null,
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
    <div className="relative">
      <SidebarButton
        icon={<Search size={20} />}
        label={t('search')}
        isActive={isActive}
        onClick={handleClick}
      />
      <ActiveIndicator isActive={!!(state.searchQuery && state.searchQuery.trim() !== '')} />
    </div>
  );
};

// History Button for Sidebar
export const SidebarHistoryButton = () => {
  const { state, dispatch } = useMainContext();
  const { t } = useI18n();
  const isActive = state.navigation === Navigations.HISTORY;
  
  const handleClick = () => {
    if (isActive) {
      dispatch({
        type: ActionTypes.SET_NAVIGATION,
        payload: null,
      });
    } else {
      dispatch({
        type: ActionTypes.SET_NAVIGATION,
        payload: Navigations.HISTORY,
      });
    }
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
  const { t } = useI18n();

  return (
    <Link to="/menu">
      <SidebarButton
        icon={<Menu size={20} />}
        label={t('menu')}
      />
    </Link>
  );
};

// Back Button for Sidebar
export const SidebarBackButton = ({ onClick }: { onClick: () => void }) => {
  const { t } = useI18n();

  return (
    <SidebarButton
      icon={<ArrowLeft size={20} />}
      label={t('common.back')}
      onClick={onClick}
    />
  );
};

// Discover Button for Sidebar
export const SidebarDiscoverButton = () => {
  const location = useLocation();
  const { t } = useI18n();
  const isActive = location.pathname === "/discover";

  return (
    <Link to="/discover">
      <SidebarButton
        icon={<Compass size={20} />}
        label={t('discover')}
        isActive={isActive}
      />
    </Link>
  );
};

 