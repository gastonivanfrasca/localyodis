import { useEffect, useState } from "react";

import { AddSourceModal } from "../../components/AddSourceModal";
import { BackgroundedButtonWithIcon } from "../../components/v2/AddSourceButton";
import { NavigationTitleWithBack } from "../../components/v2/NavigationTitleWithBack";
import { Plus } from "lucide-react";
import { SourcesList } from "../../components/SourcesList";
import { useMainContext } from "../../context/main";

export const Sources = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { state, dispatch } = useMainContext();
  const sourcesList = state.sources;

  useEffect(() => {
    dispatch({
      type: "SET_SOURCES",
      payload: sourcesList,
    });
  }, [dispatch, sourcesList]);

  return (
    <div className="w-full h-screen dark:bg-slate-950">
      <div className="flex flex-col gap-10 w-full md:items-center overflow-scroll">
        <NavigationTitleWithBack label="Sources" />
        <div className="p-8 mt-16 flex flex-col gap-8 pb-20 dark:bg-slate-950 w-full justify-center items-center">
          {sourcesList.length === 0 && (
            <p className="text-sm dark:text-gray-400">No sources added yet.</p>
          )}
          <BackgroundedButtonWithIcon
            onClick={() => setIsModalOpen(true)}
            icon={<Plus className="w-5 h-5 text-zinc-800 dark:text-zinc-200" />}
            label="Add source"
          />
          {sourcesList.length > 0 && (
            <SourcesList
              sources={sourcesList}
              setSources={(sources) => {
                dispatch({
                  type: "SET_SOURCES",
                  payload: sources,
                });
              }}
            />
          )}
        </div>
        <AddSourceModal
          isOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          setSources={(sources) => {
            dispatch({
              type: "SET_SOURCES",
              payload: sources,
            });
          }}
        />
      </div>
    </div>
  );
};
