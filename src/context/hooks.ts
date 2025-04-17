import { NavigationContext } from "./NavigationContextInstance";
import { NavigationContextProps } from "./NavigationContext.types";
import { useContext } from "react";

export const useNavigation = (): NavigationContextProps => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
};