import { HomeButtonModes, Navigations } from "../types/navigation";
import { getLocallyStoredData, storeDataLocally } from "../utils/storage";

import { Home } from "lucide-react";
import { Link } from "react-router";

type HomeButtonProps = {
  navigation: Navigations;
  setNavigation: (value: Navigations) => void;
  mode: HomeButtonModes;
};

export const HomeButton = (props: HomeButtonProps) => {
  const { navigation, setNavigation, mode } = props;
  const localData = getLocallyStoredData();

  const isActive = navigation === Navigations.HOME;
  const activeClasses = isActive
    ? "text-[#1e7bc0]"
    : "text-gray-800 dark:text-gray-400";

  const handleOnClick = () => {
    setNavigation(Navigations.HOME);
    storeDataLocally({ ...localData, navigation: Navigations.HOME });
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
