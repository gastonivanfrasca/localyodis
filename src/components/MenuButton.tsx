import { Link } from "react-router";
import { Menu } from "lucide-react";

export const MenuButton = () => {
  return (
    <Link to={"/menu"}>
      <Menu className={`cursor-pointer text-gray-800 dark:text-gray-400`} />
    </Link>
  );
}; 