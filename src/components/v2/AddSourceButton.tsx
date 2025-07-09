type AddSourceButtonProps = {
  onClick?: () => void;
  icon?: React.ReactNode;
  label?: string;
};

export const BackgroundedButtonWithIcon = (props: AddSourceButtonProps) => {
  const { onClick, icon, label } = props;
  return (
    <button
      className="cursor-pointer flex items-center justify-center w-full max-w-md mx-auto px-4 py-3 
                 bg-zinc-100 dark:bg-slate-900 
                 hover:bg-zinc-200 dark:hover:bg-slate-800 
                 rounded-xl group border border-slate-900 dark:border-zinc-400 
                 shadow-sm transition-all duration-200"
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <div className="bg-zinc-200 dark:bg-slate-800 p-2 rounded-lg group-hover:bg-zinc-300 dark:group-hover:bg-slate-700 border">
          {icon}
        </div>
        <span className="font-medium tracking-tight text-black dark:text-white text-base">
          {label}
        </span>
      </div>
    </button>
  );
};
