import { Navigations } from "../types/navigation";
import { Source } from "../types/storage"; // Import Source type

export interface NavigationContextProps {
  navigation: Navigations;
  setNavigation: (value: Navigations) => void;
  isDesktop: boolean;
  activeSources: string[]; // Add activeSources
  setActiveSources: (value: string[]) => void; // Add setActiveSources
  allSources: Source[]; // Add allSources
}