import { Dispatch, createContext, useContext } from "react";

import { LocallyStoredData } from "../../types/storage";

export type Action = {
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any;
};

export interface MainContextType {
  state: LocallyStoredData;
  dispatch: Dispatch<Action>;
}

export const MainContext = createContext<MainContextType | null>(null);

export const useMainContext = () => {
  const context = useContext(MainContext);
  if (context === null) {
    throw new Error("useMainContext must be used within an MainProvider");
  }
  return context;
};
