import React, { useEffect, useState } from "react";
import { getLocallyStoredData, storeDataLocally } from "../utils/storage"; // Import storage utils
import { Source } from "../types/storage"; // Import Source type

import { NavigationContext } from "./NavigationContextInstance";
import { Navigations } from "../types/navigation";

const DESKTOP_WIDTH = 768;

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [navigation, setNavigation] = useState<Navigations>(() => {
    // Initialize navigation from local storage or default to HOME
    const localData = getLocallyStoredData();
    return localData.navigation || Navigations.HOME;
  });
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > DESKTOP_WIDTH);
  const [allSources, setAllSources] = useState<Source[]>([]); // State for all sources
  const [activeSources, setActiveSources] = useState<string[]>([]); // State for active sources

  // Load initial data (sources and active filters)
  useEffect(() => {
    const localData = getLocallyStoredData();
    const sources = localData.sources || [];
    setAllSources(sources);
    // Initialize activeSources from storage or default to all source IDs
    setActiveSources(localData.activeSources || sources.map(s => s.id));
  }, []);

  // Persist navigation changes
  useEffect(() => {
    const localData = getLocallyStoredData();
    storeDataLocally({ ...localData, navigation });
  }, [navigation]);

  // Persist activeSources changes
  useEffect(() => {
    // Only persist if allSources has been loaded to avoid overwriting with empty array initially
    if (allSources.length > 0) {
        const localData = getLocallyStoredData();
        storeDataLocally({ ...localData, activeSources });
    }
  }, [activeSources, allSources.length]); // Add allSources.length dependency

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > DESKTOP_WIDTH);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <NavigationContext.Provider value={{ navigation, setNavigation, isDesktop, activeSources, setActiveSources, allSources }}>
      {children}
    </NavigationContext.Provider>
  );
};