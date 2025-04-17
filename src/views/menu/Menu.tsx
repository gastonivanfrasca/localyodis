import { Link } from "react-router";
import { MenuItem } from "../../components/v2/MenuItem";
import { NavBar } from "../../components/BottomNavBar";
import { NavigationWithBack } from "../../components/v2/NavigationItems";
import { Rss } from "lucide-react";
import { ThemeSwitcher } from "../../components/ThemeSwitcher";
import { useNavigation } from "../../context/hooks";

export const Menu = () => {
  const { isDesktop } = useNavigation();

  return (
    <div className="w-full h-screen dark:bg-slate-900 max-h-screen md:flex md:flex-row md:gap-0 gap-8">
      <NavBar items={<NavigationWithBack />} desktop={isDesktop} />
      <div className="flex flex-col gap-5 py-6 px-6 w-full dark:text-white text-black">
        <div className="flex items-baseline justify-between mb-1">
          <div className="text-2xl font-bold tracking-tight mb-4">Settings</div>
          <ThemeSwitcher />
        </div>
        <div className="flex flex-col gap-4 justify-center items-center w-full">
          <Link to={"/sources"} className="cursor-pointer w-full justify-center items-center flex">
            <MenuItem icon={<Rss />} label="Sources" />
          </Link>
        </div>
      </div>
    </div>
  );
};
