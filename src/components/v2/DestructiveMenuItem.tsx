type MenuItemProps = {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  chevron?: boolean;
};

export const DestructiveMenuItem = (props: MenuItemProps) => {
  const { icon, label, onClick, chevron = true } = props;
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between gap-4 px-4 py-3
                   bg-red-50 dark:bg-red-950
                   hover:bg-red-100 dark:hover:bg-red-900
                   rounded-xl group border
                   border-red-200 dark:border-red-800
                   cursor-pointer
                   "
    >
      <div className="flex items-center gap-4">
        <div className="bg-red-100 dark:bg-red-900 p-2 rounded-lg group-hover:bg-red-200 dark:group-hover:bg-red-800">
          {icon}
        </div>
        <span className="font-medium text-base tracking-tight text-red-900 dark:text-red-100">
          {label}
        </span>
      </div>
      {chevron && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-4 h-4 text-red-400 group-hover:text-red-900 dark:group-hover:text-red-100"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      )}
    </div>
  );
};
