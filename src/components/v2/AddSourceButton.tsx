import { Plus } from "lucide-react";

type AddSourceButtonProps = {
  onClick?: () => void;
};

export const AddSourceButton = (props: AddSourceButtonProps) => {
  const { onClick } = props;
  return (
    <button
      className=" self-baseline cursor-pointer flex items-center space-x-2 text-white dark:text-black px-4 py-2 font-semibold  bg-zinc-100 dark:bg-slate-900 
                   hover:bg-zinc-200 dark:hover:bg-slate-700 
                   rounded-xl transition-colors group border border-slate-800 dark:border-zinc-400 shadow-sm"
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <div className="bg-zinc-200 dark:bg-slate-800 p-2 rounded-lg group-hover:bg-zinc-300 dark:group-hover:bg-zinc-700 transition-colors border ">
         <Plus className="w-5 h-5 text-zinc-800 dark:text-zinc-200" />
        </div>
        <span className="font-medium text-base tracking-tight text-black dark:text-white">
          Add Source
        </span>
      </div>
    </button>
  );
};
