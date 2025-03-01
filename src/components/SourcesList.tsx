import { RoundedIdentifier } from "./RoundedIdentifier";
import { Source } from "../types/storage";
import { Trash2 } from "lucide-react";
import { getLocallyStoredData } from "../utils/storage";
import { removeSourceFromLocalData } from "../utils/storage";

type SourcesListProps = {
  sources: Source[];
  setSources: (sources: Source[]) => void;
};

export const SourcesList = (props: SourcesListProps) => {
  const { sources, setSources } = props;

  const handleRemoveSource = (id: string) => {
    removeSourceFromLocalData(id);
    const localData = getLocallyStoredData();
    setSources([...localData.sources]);
  };

  if (sources.length === 0) {
    return <p className="dark:text-gray-200">No sources added yet</p>;
  }
  return (
    <div className="flex flex-col gap-4 md:items-center">
      <h1 className=" text-2xl font-bold dark:text-white self-start">
        Sources
      </h1>
      {sources.map((source) => (
        <div
          className="flex flex-col gap-2  w-full md:w-[500px] border-b-2 border-b-neutral-300 p-2"
          key={source.id}
        >
          <div className="flex flex-col gap-2 rounded-sm dark:text-gray-200 p-2 grow break-words max-w-full">
            <div className="flex flex-row gap-2 items-center justify-between">
              <div className="flex flex-row gap-4 items-center">
                <RoundedIdentifier
                  color={source.color}
                  textColor={source.textColor}
                  initial={source.initial}
                />
                <p className="font-semibold text-lg text-center">
                  {source.name}
                </p>
              </div>
              <button
                className="dark:text-gray-200 underline cursor-pointer"
                onClick={() => handleRemoveSource(source.id)}
              >
                <Trash2 className="h-4 text-red-800 dark:text-red-400" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
