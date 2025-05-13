import { NavigationContext } from "../hooks/navigation";
import { Navigations } from "../types/navigation";
import { useState } from "react";

export const NavigationProvider = ({ children }: { children: React.ReactNode }) => {
  const [navigation, setNavigation] = useState<Navigations>(Navigations.HOME);
  return <NavigationContext.Provider value={{ navigation, setNavigation }}>{children}</NavigationContext.Provider>;
};



