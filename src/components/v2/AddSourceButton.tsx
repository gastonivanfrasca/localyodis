type AddSourceButtonProps = {
  onClick?: () => void;
  icon?: React.ReactNode;
  label?: string;
};

export const BackgroundedButtonWithIcon = (props: AddSourceButtonProps) => {
  const { onClick, icon, label } = props;
  return (
    <button
      className="cursor-pointer flex items-center space-x-2 text-white dark:text-black px-4 py-2 font-semibold  bg-zinc-100 dark:bg-slate-900 
                   hover:bg-zinc-200 dark:hover:bg-slate-700 
                   rounded-xl group border border-slate-800 dark:border-zinc-400 shadow-sm"
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <div className="bg-zinc-200 dark:bg-slate-800 p-2 rounded-lg group-hover:bg-zinc-300 dark:group-hover:bg-zinc-700 border ">
          {icon}
        </div>
        <span className="font-medium tracking-tight text-black dark:text-white text-sm">
          {label}
        </span>
      </div>
    </button>
  );
};
