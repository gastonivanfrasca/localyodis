import { ActionTypes, useMainContext } from "../../context/main";
import { AddRSSSourceModals, AddYTChannelModal } from "../../components/AddSourceModals";
import { Rss, Youtube } from "lucide-react";
import { useEffect, useState } from "react";

import { BackgroundedButtonWithIcon } from "../../components/v2/AddSourceButton";
import { NavigationTitleWithBack } from "../../components/v2/NavigationTitleWithBack";
import { Source } from "../../types/storage";
import { SourcesList } from "../../components/SourcesList";

export const Sources = () => {
  const [isRSSModalOpen, setIsRSSModalOpen] = useState(false);
  const [isYTModalOpen, setIsYTModalOpen] = useState(false);
  const { state, dispatch } = useMainContext();
  const sourcesList = state.sources;

  useEffect(() => {
    dispatch({
      type: ActionTypes.SET_SOURCES,
      payload: sourcesList,
    });
  }, [dispatch, sourcesList]);

  const setSources = (sources: Source[]) => {
    dispatch({
      type: ActionTypes.SET_SOURCES,
      payload: sources,
    });
  };

  return (
    <div className="w-full h-screen dark:bg-slate-950">
      <div className="flex flex-col gap-10 w-full overflow-scroll">
        <NavigationTitleWithBack label="Sources" />
        
        {/* Main Content Container - Centered on Desktop */}
        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-2xl px-8 mt-16 flex flex-col gap-8 pb-20">
            {sourcesList.length === 0 && (
              <p className="text-sm dark:text-gray-400 text-center">No sources added yet.</p>
            )}
            
            {/* Add Source Buttons */}
            <div className="flex flex-row sm:flex-row gap-4 w-full justify-center">
              <BackgroundedButtonWithIcon
                onClick={() => setIsRSSModalOpen(true)}
                icon={<Rss className="w-5 h-5 text-zinc-800 dark:text-zinc-200" />}
                label="Add RSS source"
              />
              <BackgroundedButtonWithIcon
                onClick={() => setIsYTModalOpen(true)}
                icon={<Youtube className="w-5 h-5 text-zinc-800 dark:text-zinc-200" />}
                label="Add YT channel"
              />
            </div>

            {sourcesList.length > 0 && (
              <div className="w-full">
                <SourcesList
                  sources={sourcesList}
                  setSources={setSources}
                />
              </div>
            )}
          </div>
        </div>
        
        {/* RSS Modal */}
        <AddRSSSourceModals
          isOpen={isRSSModalOpen}
          setIsModalOpen={setIsRSSModalOpen}
        />
        
        {/* YouTube Modal */}
        <AddYTChannelModal
          isOpen={isYTModalOpen}
          setIsModalOpen={setIsYTModalOpen}
        />
      </div>
    </div>
  );
};
