import { Check, Eraser } from "lucide-react";

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
    <div className="fixed top-0 left-0 w-full h-screen flex justify-center items-center p-8 bg-slate-950/70 z-50">
      <div className="bg-white dark:bg-neutral-800 rounded-lg p-8 w-11/12 max-w-md dark:text-white">
        <h2 className="text-2xl font-semibold text-center">Filter Sources</h2>
        <div className="flex flex-col gap-4 mt-4">
          {allSources.map((source) => {
            return (
              <div key={source.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="cursor-pointer rounded-sm p-4 dark:bg-neutral-700 accent-gray-800 dark:accent-gray-800 w-4 h-4"
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
            className="cursor-pointer"
            onClick={() =>
              setActiveSources(allSources.map((source) => source.id))
            }
          >
            <Eraser />
          </button>
          <button
            className="cursor-pointer"
            onClick={() => {
              dispatch({
                type: "SET_NAVIGATION",
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
