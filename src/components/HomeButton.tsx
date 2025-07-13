import { Link, useLocation } from "react-router";

import { Home } from "lucide-react";
import { HomeButtonModes } from "../types/navigation";

export interface HomeButtonProps {
  mode: HomeButtonModes;
}

export const HomeButton = (props: HomeButtonProps) => {
  const { mode } = props;
  const location = useLocation();

  const isActive = location.pathname === "/";
  const activeClasses = isActive
    ? "text-[#1e7bc0]"
    : "text-gray-800 dark:text-gray-400";

  if (mode === HomeButtonModes.LINK) {
    return (
      <Link to={"/"}>
        <Home className={`cursor-pointer ${activeClasses}`} />
      </Link>
    );
  }

  return (
    <Link to={"/"}>
      <Home className={`cursor-pointer ${activeClasses}`} />
    </Link>
  );
};
