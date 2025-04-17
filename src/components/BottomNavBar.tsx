type BottomNavBarProps = {
  items?: React.ReactNode;
  desktop?: boolean;
};

export const NavBar = (props: BottomNavBarProps) => {
  const { items, desktop } = props;

  if (!items) {
    return null;
  }

  if (desktop) {
    return (
      <nav className="h-full w-[200px] shadow-md shadow-black dark:bg-slate-900 dark:shadow-lg border-gray-400 p-2 pt-16 flex flex-col gap-6 items-center bg-white z-1">
        {items}
      </nav>
    );
  }

  return (
    <nav
      className="w-full h-12 shadow-md shadow-black  dark:bg-slate-900 dark:shadow-lg dark:shadow-white border-gray-400 p-8 flex flex-row justify-between items-center bottom-0 fixed bg-white"
      style={{ zIndex: 10 }}
    >
      {items}
    </nav>
  );
};
