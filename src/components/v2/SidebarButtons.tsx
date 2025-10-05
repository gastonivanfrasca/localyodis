import { ArrowLeft, Bookmark, Clock, Compass, Home, Menu, Search } from 'lucide-react';
import { HomeButtonModes, Navigations } from '../../types/navigation';
import { useLocation, useNavigate } from 'react-router';

import { ActionTypes } from '../../context/main';
import { ActiveIndicator } from '../ActiveIndicator';
import { SidebarButton } from './SidebarButton';
import { useI18n } from '../../context/i18n';
import kromemo from 'kromemo';
import { useMainContext } from '../../context/main';

// Home Button for Sidebar
export const SidebarHomeButton = ({ mode }: { mode: HomeButtonModes }) => {
  const { state, dispatch } = useMainContext();
  const { t } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Only active when on home page and in default state
  const isActive = location.pathname === "/" && state.navigation === null;

  const handleHomeClick = () => {
    kromemo.trackEvent({ name: 'clicked_nav_home', payload: { active: !isActive } });
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
    return (
      <SidebarButton
        icon={<Home size={20} />}
        label={t('home')}
        isActive={isActive}
        onClick={handleHomeClick}
      />
    );
  }

  return (
    <SidebarButton
      icon={<Home size={20} />}
      label={t('home')}
      isActive={isActive}
      onClick={handleHomeClick}
    />
  );
};

// Bookmarks Button for Sidebar
export const SidebarBookmarksButton = () => {
  const { state, dispatch } = useMainContext();
  const { t } = useI18n();
  const isActive = state.navigation === Navigations.BOOKMARKEDS;
  
  const handleClick = () => {
    kromemo.trackEvent({ name: 'clicked_nav_bookmarks', payload: { active: !isActive } });
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
    kromemo.trackEvent({ name: 'clicked_nav_search', payload: { active: !isActive } });
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
    kromemo.trackEvent({ name: 'clicked_nav_history', payload: { active: !isActive } });
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
  const navigate = useNavigate();

  const handleClick = () => {
    kromemo.trackEvent({ name: 'clicked_nav_menu' });
    navigate("/menu");
  };

  return (
    <SidebarButton
      icon={<Menu size={20} />}
      label={t('menu')}
      onClick={handleClick}
    />
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
  const navigate = useNavigate();
  const isActive = location.pathname === "/discover";

  const handleClick = () => {
    kromemo.trackEvent({ name: 'clicked_nav_discover' });
    navigate("/discover");
  };

  return (
    <SidebarButton
      icon={<Compass size={20} />}
      label={t('discover')}
      isActive={isActive}
      onClick={handleClick}
    />
  );
};

 
