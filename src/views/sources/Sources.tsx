import { useEffect, useState } from "react";

import { AddSourceButton } from "../../components/v2/AddSourceButton";
import { AddSourceModal } from "../../components/AddSourceModal";
import { BottomNavBar } from "../../components/BottomNavBar";
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
        <div className="p-8 flex flex-col gap-8 pb-20 dark:bg-slate-950 w-full justify-center items-center">
          <h1 className=" text-2xl font-bold dark:text-white self-start">
            Sources
          </h1>
          <AddSourceButton onClick={() => setIsModalOpen(true)} />
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
          {sourcesList.length === 0 && (
            <p className="dark:text-gray-200 text-lg">No sources added yet</p>
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
      <BottomNavBar backArrow home={"link"} />
    </div>
  );
};
