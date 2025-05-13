import { HomeButtonModes, Navigations } from "../types/navigation";

import { Home } from "lucide-react";
import { Link } from "react-router";
import { useNavigation } from "../hooks/navigation";

type HomeButtonProps = {
  mode: HomeButtonModes;
};

export const HomeButton = (props: HomeButtonProps) => {
  const { mode } = props;
  const { navigation, setNavigation } = useNavigation();

  const isActive = navigation === Navigations.HOME;
  const activeClasses = isActive
    ? "text-[#1e7bc0]"
    : "text-gray-800 dark:text-gray-400";

  const handleOnClick = () => {
    setNavigation(Navigations.HOME);
  };

  if (mode === HomeButtonModes.LINK) {
    return (
      <Link to={"/"} onClick={handleOnClick}>
        <Home className={`cursor-pointer ${activeClasses}`} />
      </Link>
    );
  }

  return (
    <button onClick={handleOnClick}>
      <Home className={`cursor-pointer ${activeClasses}`} />
    </button>
  );
};
