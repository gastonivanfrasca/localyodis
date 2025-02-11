import { Plus } from "lucide-react";

type AddSourceButtonProps = {
  setIsModalOpen: (isOpen: boolean) => void;
};

export const AddSourceButton = (props: AddSourceButtonProps) => {
  const { setIsModalOpen } = props;
  return (
    <button
      className="flex gap-4 items-center dark:text-gray-200 underline cursor-pointer"
      onClick={() => setIsModalOpen(true)}
    >
      <Plus />
      <p>Add Source</p>
    </button>
  );
};
