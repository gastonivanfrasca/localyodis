import { CornerDownLeft, EllipsisVertical, Home } from "lucide-react";

import { Link } from "react-router";

type BottomNavBarProps = {
  home?: "link" | "scroll";
  menu?: boolean;
  backArrow?: boolean;
  customButtons?: React.ReactNode;
};

export const BottomNavBar = (props: BottomNavBarProps) => {
  const { home, menu, backArrow, customButtons } = props;

  const HomeButton = () => {
    if (home === "link") {
      return (
        <Link to={"/"}>
          <Home className="dark:text-gray-400 cursor-pointer" />
        </Link>
      );
    }
    return (
      <button
        onClick={() => {
          const scrollableContainers = document.querySelectorAll('.overflow-scroll');
          scrollableContainers.forEach(container => {
            if (container instanceof HTMLElement) {
              container.scrollTop = 0;
            }
          });
        }}
      >
        <Home className="dark:text-gray-400 cursor-pointer" />
      </button>
    );
  };

  return (
    <nav className="w-full h-12 shadow-md shadow-black  dark:bg-slate-950 dark:shadow-lg dark:shadow-white border-gray-400 p-8 flex justify-between items-center bottom-0 fixed bg-white" style={{ zIndex: 10 }}>
      {backArrow && (
        <button onClick={() => window.history.back()}>
          <CornerDownLeft className="dark:text-gray-400" />
        </button>
      )}
      {home && <HomeButton />}
      {customButtons}
      {menu && (
        <Link to={"/menu"}>
          <EllipsisVertical className="dark:text-gray-400" />
        </Link>
      )}
    </nav>
  );
};
