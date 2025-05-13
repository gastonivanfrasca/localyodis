import { EllipsisVertical } from "lucide-react";
import { Link } from "react-router";
import { Navigations } from "../types/navigation";
import { useNavigation } from "../hooks/navigation";

export const SettingsButton = () => {
  const { setNavigation } = useNavigation();

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
