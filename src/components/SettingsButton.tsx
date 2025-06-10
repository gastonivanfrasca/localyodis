import { Link } from "react-router";
import { Navigations } from "../types/navigation";
import { Settings } from "lucide-react";
import { useMainContext } from "../context/main";

export const SettingsButton = () => {
  const { dispatch } = useMainContext();

  const handleOnClick = () => {
    dispatch({
      type: "SET_NAVIGATION",
      payload: Navigations.SETTINGS,
    });
  };

  return (
    <Link to={"/menu"}>
      <Settings
        onClick={handleOnClick}
        className={`cursor-pointer text-gray-800 dark:text-gray-400`}
      />
    </Link>
  );
};
