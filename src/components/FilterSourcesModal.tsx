import { Check, Eraser } from "lucide-react";

import { ActionTypes } from "../context/main";
import { Navigations } from "../types/navigation";
import { RoundedIdentifier } from "./v2/RoundedIdentifier";
import { Source } from "../types/storage";
import { useMainContext } from "../context/main";

type FilterSourcesModalProps = {
  allSources: Source[];
  activeSources: string[];
  setActiveSources: (value: string[]) => void;
};

export const FilterSourcesModal = (props: FilterSourcesModalProps) => {
  const { activeSources, setActiveSources, allSources } = props;
  const { dispatch } = useMainContext();

  return (
    <div className="fixed top-0 left-0 w-full h-screen flex justify-center items-center p-8 bg-black/50 dark:bg-black/70 z-50">
      <div className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg p-8 w-11/12 max-w-md text-gray-900 dark:text-gray-100 shadow-xl">
        <h2 className="text-2xl font-semibold text-center">Filter Sources</h2>
        <div className="flex flex-col gap-4 mt-4">
          {allSources.map((source) => {
            return (
              <div key={source.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="cursor-pointer rounded-sm p-4 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-500 accent-blue-600 dark:accent-blue-400 w-4 h-4"
                  id={source.id}
                  checked={activeSources.includes(source.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setActiveSources([...activeSources, source.id]);
                    } else {
                      setActiveSources(
                        activeSources.filter((id) => id !== source.id)
                      );
                    }
                  }}
                />
                <label
                  htmlFor={source.id}
                  className="flex flex-row items-center gap-2"
                >
                  <RoundedIdentifier
                    color={source.color}
                    textColor={source.textColor}
                    initial={source.initial}
                    video={source.type === "video"}
                    small
                  />
                  <p className="truncate max-w-[200px]">{source.name}</p>
                </label>
              </div>
            );
          })}
        </div>
        <div className="flex flex-row justify-between mt-8 gap-4">
          <button
            className="cursor-pointer p-3 rounded-lg bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300 transition-colors"
            onClick={() =>
              setActiveSources(allSources.map((source) => source.id))
            }
          >
            <Eraser />
          </button>
          <button
            className="cursor-pointer p-3 rounded-lg bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-400 text-white transition-colors"
            onClick={() => {
              dispatch({
                type: ActionTypes.SET_NAVIGATION,
                payload: Navigations.HOME,
              });
            }}
          >
            <Check />
          </button>
        </div>
      </div>
    </div>
  );
};
