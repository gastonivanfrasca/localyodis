type MenuItemProps = {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
};

export const MenuItem = (props: MenuItemProps) => {
  const { icon, label, onClick } = props;
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between gap-4 px-4 py-3 
                   bg-zinc-200 dark:bg-slate-800 
                   hover:bg-zinc-300 dark:hover:bg-slate-700 
                   rounded-xl transition-colors group md:max-w-[600px] w-full
                   "
    >
      <div className="flex items-center gap-4">
        <div className="bg-zinc-200 dark:bg-slate-800 p-2 rounded-lg group-hover:bg-zinc-300 dark:group-hover:bg-slate-700 transition-colors">
          {icon}
        </div>
        <span className="font-medium text-base tracking-tight text-black dark:text-white">
          {label}
        </span>
      </div>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-4 h-4 text-zinc-800 dark:text-zinc-400 group-hover:text-black dark:group-hover:text-white"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </div>
  );
};
