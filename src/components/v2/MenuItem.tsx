import { Check } from "lucide-react";

type MenuItemProps = {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  chevron?: boolean;
  selected?: boolean;
};

export const MenuItem = (props: MenuItemProps) => {
  const { icon, label, onClick, chevron = true, selected = false } = props;
  const selectedClasses = selected
    ? "bg-zinc-900 dark:bg-zinc-200 border-zinc-900 dark:border-zinc-300 text-white dark:text-zinc-900 shadow-sm shadow-zinc-900/10"
    : "bg-zinc-100 dark:bg-slate-800 border-zinc-200 dark:border-slate-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-slate-700";

  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between gap-4 px-4 py-3 rounded-xl group border cursor-pointer ${selectedClasses}`}
    >
      <div className="flex items-center gap-4">
        <div className="bg-zinc-200 dark:bg-slate-800 p-2 rounded-lg group-hover:bg-zinc-300 dark:group-hover:bg-slate-700">
          {icon}
        </div>
        <span className="font-medium text-base tracking-tight text-black dark:text-white">
          {label}
        </span>
      </div>
      {chevron ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-4 h-4 text-zinc-400 group-hover:text-black dark:group-hover:text-white"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      ) : (
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-100/20 dark:bg-zinc-900/20">
          <Check className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};
