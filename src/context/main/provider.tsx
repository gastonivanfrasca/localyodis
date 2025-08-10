import { Action, ActionTypes, MainContext } from ".";
import { extractItemTitle, filterHiddenItems, getLocallyStoredData, storeDataLocally } from "../../utils/storage";
import { useEffect, useReducer } from "react";

import { LocallyStoredData } from "../../types/storage";
import { getBrowserLanguage } from "../../i18n";

const localData = getLocallyStoredData();

// Filter out any hidden items from the loaded data to prevent glitches
const filteredItems = filterHiddenItems(localData.items, localData.hiddenItems || []);

const initialState: LocallyStoredData = {
  items: filteredItems,
  sources: localData.sources,
  theme: localData.theme,
  language: localData.language || getBrowserLanguage(),
  bookmarks: localData.bookmarks,
  navigation: localData.navigation || null,
  lastUpdated: localData.lastUpdated,
  activeSources: localData.activeSources || localData.sources.map((source) => source.id),
  scrollPosition: localData.scrollPosition,
  loading: localData.loading,
  searchQuery: localData.searchQuery || null,
  activeItems: filteredItems,
  error: null,
  hiddenItems: localData.hiddenItems || [],
  history: localData.history || [],
  hasSeenWelcome: localData.hasSeenWelcome || false,
};


const reducer = (state: LocallyStoredData, action: Action) => {
  switch (action.type) {
    case ActionTypes.SET_ITEMS:
      return { ...state, items: action.payload };
    case ActionTypes.SET_SOURCES:
      return { ...state, sources: action.payload };
    case ActionTypes.UPDATE_SOURCE:
      return { 
        ...state, 
        sources: state.sources.map(source => 
          source.id === action.payload.id 
            ? { ...source, ...action.payload } 
            : source
        )
      };
    case ActionTypes.SET_THEME:
      return { ...state, theme: action.payload };
    case ActionTypes.SET_LANGUAGE:
      return { ...state, language: action.payload };
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
    case ActionTypes.SET_HIDDEN_ITEMS:
      return { ...state, hiddenItems: action.payload };
    case ActionTypes.HIDE_ITEM:
      return { 
        ...state, 
        hiddenItems: [...state.hiddenItems, action.payload],
        activeItems: state.activeItems.filter(item => extractItemTitle(item) !== action.payload)
      };
    case ActionTypes.UNHIDE_ITEM:
      return { 
        ...state, 
        hiddenItems: state.hiddenItems.filter(id => id !== action.payload)
      };
    case ActionTypes.ADD_TO_HISTORY:
      return { 
        ...state, 
        history: [action.payload, ...state.history.slice(0, 99)] // Keep last 100 items
      };
    case ActionTypes.CLEAR_HISTORY:
      return { ...state, history: [] };
    case ActionTypes.REMOVE_FROM_HISTORY:
      return { 
        ...state, 
        history: state.history.filter(item => item.link !== action.payload)
      };
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

