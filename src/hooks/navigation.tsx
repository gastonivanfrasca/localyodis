import { createContext, useContext } from "react";
import { getLocallyStoredData, storeDataLocally } from "../utils/storage";

import { Navigations } from "../types/navigation";

export const NavigationContext = createContext<{
  navigation: Navigations;
  setNavigation: (navigation: Navigations) => void;
}>({
  navigation: getLocallyStoredData().navigation,
  setNavigation: (navigation: Navigations) => {
    storeDataLocally({
      ...getLocallyStoredData(),
      navigation,
    });
  },
});

export const useNavigation = () => {
  return useContext(NavigationContext);
};
