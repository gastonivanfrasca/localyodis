import { CornerDownLeft, EllipsisVertical, Home } from "lucide-react";

import { Link } from "react-router";

type BottomNavBarProps = {
  home?: boolean;
  menu?: boolean;
  backArrow?: boolean;
};

export const BottomNavBar = (props: BottomNavBarProps) => {
  const { home, menu, backArrow } = props;
  return (
    <nav className="w-full h-12 shadow-md shadow-black dark:shadow-white dark:bg-neutral-800 p-8 flex justify-between items-center bottom-0 absolute">
      {backArrow && (
        <button onClick={() => window.history.back()}>
          <CornerDownLeft className="dark:text-gray-200" />
        </button>
      )}
      {home && (
        <Link to={"/"}>
          <Home className="dark:text-gray-200" />
        </Link>
      )}
      {menu && (
        <Link to={"/menu"}>
          <EllipsisVertical className="dark:text-gray-200" />
        </Link>
      )}
    </nav>
  );
};
