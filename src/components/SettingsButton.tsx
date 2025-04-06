import { EllipsisVertical } from "lucide-react";
import { Link } from "react-router";
import { Navigations } from "../types/navigation";

type SettingsButtonProps = {
  navigation: Navigations;
  setNavigation: (value: Navigations) => void;
};

export const SettingsButton = (props: SettingsButtonProps) => {
  const { setNavigation } = props;

  const handleOnClick = () => {
    setNavigation(Navigations.SETTINGS);
  };

  return (
    <Link to={"/menu"}>
      <EllipsisVertical
        onClick={handleOnClick}
        className={`cursor-pointer text-gray-800 dark:text-gray-400`}
      />
    </Link>
  );
};
