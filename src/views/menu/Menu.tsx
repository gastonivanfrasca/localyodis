import { ActionTypes, useMainContext } from "../../context/main";
import { BarChart3, Clock, FileText, Shield, Rss, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router";

import { MenuItem } from "../../components/v2/MenuItem";
import { NavigationTitleWithBack } from "../../components/v2/NavigationTitleWithBack";
import { Navigations } from "../../types/navigation";
import Snackbar from "../../components/Snackbar";
import { ThemeSwitcher } from "../../components/ThemeSwitcher";
import { useI18n } from "../../context/i18n";

export const Menu = () => {
  const navigate = useNavigate();
  const { dispatch } = useMainContext();
  const { t } = useI18n();

  const handleHistoryClick = () => {
    dispatch({
      type: ActionTypes.SET_NAVIGATION,
      payload: Navigations.HISTORY,
    });
    navigate("/");
  };

  return (
    <div className="min-h-dvh bg-white dark:bg-slate-950 text-black dark:text-white font-sans flex flex-col">
      <NavigationTitleWithBack label={t('menu.title')} />
      
      {/* Main Content Container - Centered on Desktop */}
      <div className="flex-1 flex justify-center">
        <div className="w-full max-w-2xl px-6 mt-16 flex flex-col gap-5 py-6">
          <Link to={"/sources"} className="cursor-pointer">
            <MenuItem icon={<Rss />} label={t('sources.title')} />
          </Link>
          <button onClick={handleHistoryClick} className="cursor-pointer">
            <MenuItem icon={<Clock />} label={t('history.title')} />
          </button>
          <Link to={"/statistics"} className="cursor-pointer">
            <MenuItem icon={<BarChart3 />} label={t('statistics.title')} />
          </Link>
          <Link to={"/settings"} className="cursor-pointer">
            <MenuItem icon={<Settings />} label={t('settings.title')} />
          </Link>
          <Link to={"/privacy-policy"} className="cursor-pointer">
            <MenuItem icon={<Shield />} label={t('menu.privacy')} />
          </Link>
          <Link to={"/terms-of-use"} className="cursor-pointer">
            <MenuItem icon={<FileText />} label={t('menu.terms')} />
          </Link>
          <ThemeSwitcher />
          <Snackbar />
        </div>
      </div>
    </div>
  );
};
