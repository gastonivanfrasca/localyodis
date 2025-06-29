import { Link } from "react-router";
import { MenuItem } from "../../components/v2/MenuItem";
import { NavigationTitleWithBack } from "../../components/v2/NavigationTitleWithBack";
import { Rss } from "lucide-react";
import Snackbar from "../../components/Snackbar";
import { ThemeSwitcher } from "../../components/ThemeSwitcher";

export const Menu = () => {

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-black dark:text-white font-sans flex flex-col">
      <NavigationTitleWithBack label="Menu" />
      
      {/* Main Content Container - Centered on Desktop */}
      <div className="flex-1 flex justify-center">
        <div className="w-full max-w-2xl px-6 mt-16 flex flex-col gap-5 py-6">
          <Link to={"/sources"} className="cursor-pointer">
            <MenuItem icon={<Rss />} label="Sources" />
          </Link>
          <ThemeSwitcher />
          <Snackbar />
        </div>
      </div>
    </div>
  );
};
