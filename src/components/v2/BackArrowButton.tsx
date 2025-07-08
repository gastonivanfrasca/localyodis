import { ArrowLeftIcon } from "lucide-react";

type BackArrowButtonProps = {
  className?: string;
};

export const BackArrowButton = (props: BackArrowButtonProps) => (
  <button 
    className={`cursor-pointer p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${props.className}`} 
    onClick={() => window.history.back()}
  >
    <ArrowLeftIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
  </button>
);
