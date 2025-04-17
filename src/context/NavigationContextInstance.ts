import { NavigationContextProps } from "./NavigationContext.types";
import { createContext } from "react";

export const NavigationContext = createContext<NavigationContextProps | undefined>(undefined);