import { BottomNavBar } from "../../components/BottomNavBar";
import { Link } from "react-router";
import { Rss } from "lucide-react";
import { ThemeSwitcher } from "../../components/ThemeSwitcher";

export const Menu = () => {
  return (
    <div className="w-full h-screen dark:bg-neutral-800">
      <div className="p-8 flex flex-col gap-4 ">
        <ThemeSwitcher />
        <SourcesBtn />
      </div>
      <BottomNavBar backArrow home />
    </div>
  );
};

const SourcesBtn = () => {
  return (
    <Link to={"/sources"} className="flex gap-4 items-center dark:text-gray-200 p-2 underline">
        <Rss />
        <p>Sources</p>
    </Link>
  );
};
