import { getLocallyStoredData, storeDataLocally } from "../../utils/storage";
import { useEffect, useReducer } from "react";

import { LocallyStoredData } from "../../types/storage";
import { MainContext } from ".";
import { Navigations } from "../../types/navigation";

const localData = getLocallyStoredData();

const initialState: LocallyStoredData = {
  items: localData.items,
  sources: localData.sources,
  theme: localData.theme,
  bookmarks: localData.bookmarks,
  navigation: localData.navigation || Navigations.HOME,
  lastUpdated: localData.lastUpdated,
  activeSources: localData.activeSources || localData.sources.map((source) => source.id),
  scrollPosition: localData.scrollPosition,
  loading: localData.loading,
};

type Action = {
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any;
};

const actionTypes = {
  SET_ITEMS: "SET_ITEMS",
  SET_SOURCES: "SET_SOURCES",
  SET_THEME: "SET_THEME",
  SET_BOOKMARKS: "SET_BOOKMARKS",
  SET_NAVIGATION: "SET_NAVIGATION",
  SET_LAST_UPDATED: "SET_LAST_UPDATED",
  SET_ACTIVE_SOURCES: "SET_ACTIVE_SOURCES",
  SET_SCROLL_POSITION: "SET_SCROLL_POSITION",
  SET_LOADING: "SET_LOADING",
};

const reducer = (state: LocallyStoredData, action: Action) => {
  switch (action.type) {
    case actionTypes.SET_ITEMS:
      return { ...state, items: action.payload };
    case actionTypes.SET_SOURCES:
      return { ...state, sources: action.payload };
    case actionTypes.SET_THEME:
      return { ...state, theme: action.payload };
    case actionTypes.SET_BOOKMARKS:
      return { ...state, bookmarks: action.payload };
    case actionTypes.SET_NAVIGATION:
      return { ...state, navigation: action.payload };
    case actionTypes.SET_LAST_UPDATED:
      return { ...state, lastUpdated: action.payload };
    case actionTypes.SET_ACTIVE_SOURCES:
      return { ...state, activeSources: action.payload };
    case actionTypes.SET_SCROLL_POSITION:
      return { ...state, scrollPosition: action.payload };
    case actionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
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

