import { Moon, Sun } from "lucide-react";

import { useMainContext } from "../context/main";

enum Themes {
  DARK = "dark",
  LIGHT = "light",
}

const getThemeIcon = (theme: Themes) => {
  return theme === Themes.DARK ? <Moon className="w-5" /> : <Sun className="w-5" />;
};

export const ThemeSwitcher = () => {
  const { state, dispatch } = useMainContext();
  const localTheme = state.theme as Themes;
  const icon = getThemeIcon(localTheme);

  const setThemeAndSyncStorage = (theme: Themes) => {
    if (theme === Themes.DARK) {
      document.body.classList.remove("light");
    }
    if (theme === Themes.LIGHT) {
      document.body.classList.remove("dark");
    }
    document.body.classList.add(theme);
    dispatch({ type: "SET_THEME", payload: theme });
  };

  return (
    <button
      onClick={() => {
        if (localTheme === Themes.DARK) {
          setThemeAndSyncStorage(Themes.LIGHT);
        } else {
          setThemeAndSyncStorage(Themes.DARK);
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
