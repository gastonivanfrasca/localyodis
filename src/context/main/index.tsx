import { Dispatch, createContext, useContext } from "react";

import { LocallyStoredData } from "../../types/storage";

export type Action = {
  type: ActionTypes;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any;
};

export interface MainContextType {
  state: LocallyStoredData;
  dispatch: Dispatch<Action>;
}

export enum ActionTypes {
  SET_ITEMS = "SET_ITEMS",
  SET_SOURCES = "SET_SOURCES",
  UPDATE_SOURCE = "UPDATE_SOURCE",
  SET_THEME = "SET_THEME",
  SET_LANGUAGE = "SET_LANGUAGE",
  SET_BOOKMARKS = "SET_BOOKMARKS",
  SET_NAVIGATION = "SET_NAVIGATION",
  SET_SEARCH_QUERY = "SET_SEARCH_QUERY",
  CLEAR_SEARCH_QUERY = "CLEAR_SEARCH_QUERY",
  SET_ACTIVE_ITEMS = "SET_ACTIVE_ITEMS",
  SET_LAST_UPDATED = "SET_LAST_UPDATED",
  SET_ACTIVE_SOURCES = "SET_ACTIVE_SOURCES",
  SET_SCROLL_POSITION = "SET_SCROLL_POSITION",
  SET_LOADING = "SET_LOADING",
  SET_ERROR = "SET_ERROR",
  CLEAR_ERROR = "CLEAR_ERROR",
  SET_HIDDEN_ITEMS = "SET_HIDDEN_ITEMS",
  HIDE_ITEM = "HIDE_ITEM",
  UNHIDE_ITEM = "UNHIDE_ITEM",
  ADD_TO_HISTORY = "ADD_TO_HISTORY",
  CLEAR_HISTORY = "CLEAR_HISTORY",
  REMOVE_FROM_HISTORY = "REMOVE_FROM_HISTORY",
  SET_NEW_ITEMS_STATUS = "SET_NEW_ITEMS_STATUS",
}

export const MainContext = createContext<MainContextType | null>(null);

export const useMainContext = () => {
  const context = useContext(MainContext);
  if (context === null) {
    throw new Error("useMainContext must be used within an MainProvider");
  }
  return context;
};
