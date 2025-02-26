import { useEffect, useState } from "react";

import { AddSourceButton } from "../../components/AddSourceButton";
import { AddSourceModal } from "../../components/AddSourceModal";
import { BottomNavBar } from "../../components/BottomNavBar";
import { Source } from "../../types/storage";
import { SourcesList } from "../../components/SourcesList";
import { getLocallyStoredData } from "../../utils/storage";

export const Sources = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sources, setSources] = useState<Source[]>([]);
  const localData = getLocallyStoredData();
  const sourcesList = localData.sources;
  
  useEffect(() => {
    setSources(sourcesList);
  }, []);

  return (
    <div className="w-full h-screen dark:bg-neutral-800">
      <div className="p-8 flex flex-col gap-8">
        <AddSourceButton setIsModalOpen={setIsModalOpen} />
        {sourcesList.length > 1 && (<SourcesList sources={sources} setSources={setSources} />)}
      </div>
      <AddSourceModal isOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      <BottomNavBar backArrow home />
    </div>
  );
};
