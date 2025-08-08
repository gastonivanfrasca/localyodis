import { ActionTypes, useMainContext } from "../../context/main";
import { useEffect, useState } from "react";

import { AddRSSSourceModals } from "../../components/AddSourceModals";
import { BackgroundedButtonWithIcon } from "../../components/v2/AddSourceButton";
import { NavigationTitleWithBack } from "../../components/v2/NavigationTitleWithBack";
import { Rss } from "lucide-react";
import { Source } from "../../types/storage";
import { SourcesList } from "../../components/SourcesList";
import { useI18n } from "../../context/i18n";

export const Sources = () => {
  const [isRSSModalOpen, setIsRSSModalOpen] = useState(false);
  const { state, dispatch } = useMainContext();
  const { t } = useI18n();
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
    <div className="w-full h-dvh dark:bg-slate-950 bg-white">
      <div className="flex flex-col h-full w-full">
        <NavigationTitleWithBack label={t('sources.title')} />
        
        {/* Main Content Container - Centered on Desktop */}
        <div className="flex-1 flex justify-center bg-white dark:bg-slate-950">
          <div className="w-full max-w-2xl px-8 mt-20 md:mt-16 flex flex-col gap-8 pb-20 bg-white dark:bg-slate-950">
            {sourcesList.length === 0 && (
              <p className="text-sm dark:text-gray-400 text-center">{t('sources.empty')}</p>
            )}
            
            {/* Add Source Buttons */}
            <div className="flex flex-row sm:flex-row gap-4 w-full justify-center">
              <BackgroundedButtonWithIcon
                onClick={() => setIsRSSModalOpen(true)}
                icon={<Rss className="w-5 h-5 text-zinc-800 dark:text-zinc-200" />}
                label={t('sources.addRss')}
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
      </div>
      
    </div>
  );
};
