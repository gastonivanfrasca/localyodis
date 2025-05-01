import React, { useEffect, useState } from "react";

import { NavigationContext } from "./NavigationContextInstance";
import { Navigations } from "../types/navigation";

const DESKTOP_WIDTH = 768;

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [navigation, setNavigation] = useState<Navigations>(Navigations.HOME);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > DESKTOP_WIDTH);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <NavigationContext.Provider value={{ navigation, setNavigation, isDesktop }}>
      {children}
    </NavigationContext.Provider>
  );
};