type BottomNavBarProps = {
  customButtons?: React.ReactNode;
};

export const BottomNavBar = (props: BottomNavBarProps) => {
  const { customButtons } = props;

  return (
    <nav
      className="w-full h-16 shadow-md shadow-black bg-white dark:bg-slate-950 dark:shadow-lg dark:shadow-white border-gray-400 flex items-center bottom-0 fixed"
      style={{ zIndex: 10 }}
    >
      {customButtons}
    </nav>
  );
};
