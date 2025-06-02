import { EllipsisVertical } from "lucide-react";
import { Link } from "react-router";
import { Navigations } from "../types/navigation";
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
      <EllipsisVertical
        onClick={handleOnClick}
        className={`cursor-pointer text-gray-800 dark:text-gray-400`}
      />
    </Link>
  );
};
