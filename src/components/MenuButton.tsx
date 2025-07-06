import { ActionTypes } from "../context/main";
import { Link } from "react-router";
import { Navigations } from "../types/navigation";
import { Menu } from "lucide-react";
import { useMainContext } from "../context/main";

export const MenuButton = () => {
  const { dispatch } = useMainContext();

  const handleOnClick = () => {
    dispatch({
      type: ActionTypes.SET_NAVIGATION,
      payload: Navigations.SETTINGS,
    });
  };

  return (
    <Link to={"/menu"}>
      <Menu
        onClick={handleOnClick}
        className={`cursor-pointer text-gray-800 dark:text-gray-400`}
      />
    </Link>
  );
}; 