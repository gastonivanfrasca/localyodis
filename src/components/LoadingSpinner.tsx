import { LoaderCircle } from "lucide-react";

export const LoadingSpinner = () => {
  return (
    <div className="flex flex-row gap-2 items-center absolute bottom-[120px] right-10 bg-white dark:bg-neutral-800 p-2 rounded-lg shadow-lg">
      <LoaderCircle className="animate-spin h-8 w-8 dark:text-white"/> 
    </div>
  );
};
