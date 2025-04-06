import { useEffect, useState } from "react";

import { AddSourceModal } from "../../components/AddSourceModal";
import { BottomNavBar } from "../../components/BottomNavBar";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { Source } from "../../types/storage";
import { SourcesList } from "../../components/SourcesList";
import { getLocallyStoredData } from "../../utils/storage";

export const Sources = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(false);
  const localData = getLocallyStoredData();
  const sourcesList = localData.sources;

  useEffect(() => {
    setSources([...sourcesList]);
  }, []);

  return (
    <div className="w-full h-screen dark:bg-slate-950">
      <div className="p-8 flex flex-col gap-8 pb-20 dark:bg-slate-950">
        {sources.length > 0 && (
          <SourcesList sources={sources} setSources={setSources} setIsModalOpen={setIsModalOpen} />
        )}
        {sources.length === 0 && (
          <p className="dark:text-gray-200 text-lg">No sources added yet</p>
        )}
      </div>
      <AddSourceModal
        isOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        setSources={setSources}
        setLoading={setLoading}
      />
      <BottomNavBar backArrow home={"link"} />
      {loading && <LoadingSpinner />}
    </div>
  );
};
