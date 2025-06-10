import { Link } from "react-router";
import { MenuItem } from "../../components/v2/MenuItem";
import { NavigationTitleWithBack } from "../../components/v2/NavigationTitleWithBack";
import { Rss } from "lucide-react";
import { ThemeSwitcher } from "../../components/ThemeSwitcher";

export const Menu = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-black dark:text-white font-sans flex flex-col justify-between">
      <NavigationTitleWithBack label="Menu" />
      <aside className="flex flex-col gap-5 py-6 px-6 mt-16">
        <Link to={"/sources"} className="cursor-pointer">
          <MenuItem icon={<Rss />} label="Sources" />
        </Link>
        <ThemeSwitcher />
      </aside>
    </div>
  );
};
