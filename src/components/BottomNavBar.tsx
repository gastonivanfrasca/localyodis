type BottomNavBarProps = {
  customButtons?: React.ReactNode;
};

export const BottomNavBar = (props: BottomNavBarProps) => {
  const { customButtons } = props;

  return (
    <nav
      className="w-full h-12 shadow-md shadow-black  dark:bg-slate-950 dark:shadow-lg dark:shadow-white border-gray-400 p-8 flex justify-between items-center bottom-0 fixed bg-white"
      style={{ zIndex: 10 }}
    >
      {customButtons}
    </nav>
  );
};
