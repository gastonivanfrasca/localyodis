import { Moon, Sun } from "lucide-react";
import { getLocallyStoredData, storeDataLocally } from "../utils/storage";

import { useState } from "react";

export const ThemeSwitcher = () => {
  const localData = getLocallyStoredData();
  const localTheme = localData.theme;
  const [theme, setTheme] = useState(localTheme);
  const icon =
    theme === "dark" ? <Moon className="w-5" /> : <Sun className="w-5" />;

  const setThemeAndSyncStorage = (theme: string) => {
    if (theme === "dark") {
      document.body.classList.remove("light");
    }
    if (theme === "light") {
      document.body.classList.remove("dark");
    }
    document.body.classList.add(theme);
    const localData = getLocallyStoredData();
    storeDataLocally({ ...localData, theme });
    setTheme(theme);
  };

  return (
    <button
      onClick={() => {
        if (theme === "dark") {
          setThemeAndSyncStorage("light");
        } else {
          setThemeAndSyncStorage("dark");
        }
      }}
      type="button"
      className="flex items-center justify-start py-2 border bg-zinc-100 dark:bg-slate-800 
                   hover:bg-zinc-200 dark:hover:bg-zinc-700 
                   rounded-xl transition-colors group font-semibold shadow-sm px-3
                   border-slate-800 dark:border-zinc-400
                   "
    >
      {icon}
    </button>
  );
};
