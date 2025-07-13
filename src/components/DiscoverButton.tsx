import { Link, useLocation } from "react-router";

import { Compass } from "lucide-react";

export const DiscoverButton = () => {
  const location = useLocation();
  const isActive = location.pathname === "/discover";
  const activeClasses = isActive
    ? "text-[#1e7bc0]"
    : "text-gray-800 dark:text-gray-400";

  return (
    <Link to="/discover">
      <Compass className={`cursor-pointer ${activeClasses}`} />
    </Link>
  );
}; 