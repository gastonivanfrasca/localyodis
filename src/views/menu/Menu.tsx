import { BottomNavBar } from "../../components/BottomNavBar";
import { Link } from "react-router";
import { MenuItem } from "../../components/v2/MenuItem";
import { Rss } from "lucide-react";
import { ThemeSwitcher } from "../../components/ThemeSwitcher";

export const Menu = () => {
  return (
    <div className="min-h-screen transition-colors duration-500 bg-white dark:bg-slate-950 text-black dark:text-white font-sans flex flex-col justify-between">
      <aside className="flex flex-col gap-5 py-6 px-6">
        <div className="flex items-baseline justify-between mb-1">
          <div className="text-2xl font-bold tracking-tight mb-4">Menu</div>
          <ThemeSwitcher />
        </div>
        <Link to={"/sources"} className="cursor-pointer">
          <MenuItem icon={<Rss />} label="Sources" />
        </Link>
      </aside>
      <BottomNavBar backArrow home={"link"} />
    </div>
  );
};
