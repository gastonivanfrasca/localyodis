import { AddSourceModal } from "../../components/AddSourceModal";
import { BottomNavBar } from "../../components/BottomNavBar";
import { Plus } from "lucide-react";
import { useState } from "react";

export const Sources = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="w-full h-screen dark:bg-neutral-800">
      <div className="p-8">
        <button
          className="flex gap-4 items-center dark:text-gray-200 underline"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus />
          <p>Add Source</p>
        </button>
      </div>
      <AddSourceModal isOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      <BottomNavBar backArrow home />
    </div>
  );
};
