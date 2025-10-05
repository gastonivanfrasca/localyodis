import { ActionTypes, useMainContext } from "../context/main";
import { Moon, Sun } from "lucide-react";

import { MenuItem } from "./v2/MenuItem";
import { useI18n } from "../context/i18n";
import { trackEvent } from "../utils/analytics";

enum Themes {
  DARK = "dark",
  LIGHT = "light",
}

const getThemeIcon = (theme: Themes) => {
  return theme === Themes.DARK ? (
    <Moon className="w-5" />
  ) : (
    <Sun className="w-5" />
  );
};

export const ThemeSwitcher = () => {
  const { state, dispatch } = useMainContext();
  const { t } = useI18n();
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
    dispatch({ type: ActionTypes.SET_THEME, payload: theme });
    trackEvent("theme_switched", { theme });
  };

  return (
    <MenuItem
      label={t('a11y.switchTheme')}
      icon={icon}
      chevron={false}
      onClick={() => {
        if (localTheme === Themes.DARK) {
          setThemeAndSyncStorage(Themes.LIGHT);
        } else {
          setThemeAndSyncStorage(Themes.DARK);
        }
      }}
    />
  );
};
