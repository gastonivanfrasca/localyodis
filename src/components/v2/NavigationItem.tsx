type NavigationItemProps = {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  showLabel?: boolean;
  isActive?: boolean;
};

export const NavigationItem = (props: NavigationItemProps) => {
  const { icon, label, onClick, showLabel } = props;
  return (
    <button
      className={`flex items-center md:content-start justify-start space-x-2 text-black dark:text-white px-3 py-2 font-semibold 
                   hover:bg-zinc-200 dark:hover:bg-slate-700 
                   rounded-xl transition-colors group md:border-slate-800 md:dark:border-zinc-400  md:w-32 cursor-pointer`}
      onClick={onClick}
    >
      <div>{icon}</div>
      {showLabel && <span className="text-sm">{label}</span>}
    </button>
  );
};
