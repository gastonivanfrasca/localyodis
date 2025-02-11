import { AddSourceButton } from "../../components/AddSourceButton";
import { AddSourceModal } from "../../components/AddSourceModal";
import { BottomNavBar } from "../../components/BottomNavBar";
import { SourcesList } from "../../components/SourcesList";
import { getLocallyStoredData } from "../../utils/storage";
import { useState } from "react";

export const Sources = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const localData = getLocallyStoredData();
  const sourcesList = localData.sources;

  return (
    <div className="w-full h-screen dark:bg-neutral-800">
      <div className="p-8 flex flex-col gap-8">
        <AddSourceButton setIsModalOpen={setIsModalOpen} />
        <SourcesList sources={sourcesList} />
      </div>
      <AddSourceModal isOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      <BottomNavBar backArrow home />
    </div>
  );
};
