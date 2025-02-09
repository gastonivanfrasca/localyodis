import { Moon, Sun } from "lucide-react";
import { getLocallyStoredData, storeDataLocally } from "../utils/storage";

import { useState } from "react";

export const ThemeSwitcher = () => {
  const localData = getLocallyStoredData();
  const localTheme = localData.theme;
  const [theme, setTheme] = useState(localTheme);
  const icon = theme === "dark" ? <Sun /> : <Moon />;

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
      className="p-2  border-gray-200 rounded-md dark:border-gray-300 dark:text-gray-200 flex gap-4 items-center"
      onClick={() =>
        setThemeAndSyncStorage(theme === "dark" ? "light" : "dark")
      }
    >
      {icon}
    </button>
  );
};
