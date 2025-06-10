import { ArrowLeftIcon } from "lucide-react";

type BackArrowButtonProps = {
  className?: string;
};

export const BackArrowButton = (props: BackArrowButtonProps) => (
  <button className={`cursor-pointer ${props.className}`} onClick={() => window.history.back()}>
    <ArrowLeftIcon className="dark:text-gray-400" />
  </button>
);
