import { Action, ActionTypes, MainContext } from ".";
import { getLocallyStoredData, storeDataLocally } from "../../utils/storage";
import { useEffect, useReducer } from "react";

import { LocallyStoredData } from "../../types/storage";
import { Navigations } from "../../types/navigation";

const localData = getLocallyStoredData();

// Determine if this is a first-time user (no sources configured)
const isFirstTimeUser = localData.sources.length === 0;

const initialState: LocallyStoredData = {
  items: localData.items,
  sources: localData.sources,
  theme: localData.theme,
  bookmarks: localData.bookmarks,
  navigation: isFirstTimeUser ? Navigations.FTU : (localData.navigation || Navigations.HOME),
  lastUpdated: localData.lastUpdated,
  activeSources: localData.activeSources || localData.sources.map((source) => source.id),
  scrollPosition: localData.scrollPosition,
  loading: localData.loading,
  searchQuery: localData.searchQuery || null,
  activeItems: localData.items,
  error: null,
};


const reducer = (state: LocallyStoredData, action: Action) => {
  switch (action.type) {
    case ActionTypes.SET_ITEMS:
      return { ...state, items: action.payload };
    case ActionTypes.SET_SOURCES:
      return { ...state, sources: action.payload };
    case ActionTypes.SET_THEME:
      return { ...state, theme: action.payload };
    case ActionTypes.SET_BOOKMARKS:
      return { ...state, bookmarks: action.payload };
    case ActionTypes.SET_NAVIGATION:
      return { ...state, navigation: action.payload };
    case ActionTypes.SET_LAST_UPDATED:
      return { ...state, lastUpdated: action.payload };
    case ActionTypes.SET_ACTIVE_SOURCES:
      return { ...state, activeSources: action.payload };
    case ActionTypes.SET_SCROLL_POSITION:
      return { ...state, scrollPosition: action.payload };
    case ActionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    case ActionTypes.SET_SEARCH_QUERY:
      return { ...state, searchQuery: action.payload };
    case ActionTypes.CLEAR_SEARCH_QUERY:
      return { ...state, searchQuery: null };
    case ActionTypes.SET_ACTIVE_ITEMS:
      return { ...state, activeItems: action.payload };
    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload };
    case ActionTypes.CLEAR_ERROR:
      return { ...state, error: null };
    default:    
      return state;
  }
};

export const MainProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    storeDataLocally(state);
  }, [state]);

  return (
    <MainContext.Provider value={{ state, dispatch }}>
      {children}
    </MainContext.Provider>
  );
};

