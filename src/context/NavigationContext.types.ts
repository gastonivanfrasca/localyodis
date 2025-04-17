import { Navigations } from "../types/navigation";

export interface NavigationContextProps {
  navigation: Navigations;
  setNavigation: (value: Navigations) => void;
  isDesktop: boolean;
}