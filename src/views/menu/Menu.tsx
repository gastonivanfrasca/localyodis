import { Link } from "react-router";
import { MenuItem } from "../../components/v2/MenuItem";
import { NavigationTitleWithBack } from "../../components/v2/NavigationTitleWithBack";
import { Rss, Sparkles, RotateCcw } from "lucide-react";
import Snackbar from "../../components/Snackbar";
import { ThemeSwitcher } from "../../components/ThemeSwitcher";
import { ActionTypes, useMainContext } from "../../context/main";
import { Navigations } from "../../types/navigation";

export const Menu = () => {
  const { dispatch } = useMainContext();

  const handleGoToFTU = () => {
    dispatch({
      type: ActionTypes.SET_NAVIGATION,
      payload: Navigations.FTU,
    });
  };

  const handleResetToFTU = () => {
    // Clear all sources to simulate first-time user experience
    dispatch({
      type: ActionTypes.SET_SOURCES,
      payload: [],
    });
    dispatch({
      type: ActionTypes.SET_ACTIVE_SOURCES,
      payload: [],
    });
    dispatch({
      type: ActionTypes.SET_NAVIGATION,
      payload: Navigations.FTU,
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-black dark:text-white font-sans flex flex-col">
      <NavigationTitleWithBack label="Menu" />
      
      {/* Main Content Container - Centered on Desktop */}
      <div className="flex-1 flex justify-center">
        <div className="w-full max-w-2xl px-6 mt-16 flex flex-col gap-5 py-6">
          <Link to={"/sources"} className="cursor-pointer">
            <MenuItem icon={<Rss />} label="Sources" />
          </Link>
          
          {/* Temporary FTU test buttons - Remove in production */}
          <div onClick={handleGoToFTU} className="cursor-pointer">
            <MenuItem icon={<Sparkles />} label="First Time User (Test)" />
          </div>
          
          <div onClick={handleResetToFTU} className="cursor-pointer">
            <MenuItem icon={<RotateCcw />} label="Reset & Go to FTU" />
          </div>
          
          <ThemeSwitcher />
          <Snackbar />
        </div>
      </div>
    </div>
  );
};
