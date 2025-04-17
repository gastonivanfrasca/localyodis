import { useEffect, useState } from "react";

import { AddSourceModal } from "../../components/AddSourceModal";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { NavBar } from "../../components/BottomNavBar";
import { NavigationWithBack } from "../../components/v2/NavigationItems";
import { Source } from "../../types/storage";
import { SourcesList } from "../../components/SourcesList";
import { getLocallyStoredData } from "../../utils/storage";
import { useNavigation } from "../../context/hooks";

export const Sources = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(false);
  const localData = getLocallyStoredData();
  const sourcesList = localData.sources;
  const { isDesktop } = useNavigation();

  useEffect(() => {
    setSources([...sourcesList]);
  }, []);

  return (
    <div className="w-full h-screen dark:bg-slate-900 max-h-screen md:flex md:flex-row md:gap-0 gap-8">
      <NavBar items={<NavigationWithBack />} desktop={isDesktop} />
      <div className="w-full">
        <div className="p-8 flex flex-col gap-8 pb-20 dark:bg-slate-900 w-full">
          <SourcesList
            sources={sources}
            setSources={setSources}
            setIsModalOpen={setIsModalOpen}
          />
        </div>
        <AddSourceModal
          isOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          setSources={setSources}
          setLoading={setLoading}
        />
        {loading && <LoadingSpinner />}
      </div>
    </div>
  );
};
