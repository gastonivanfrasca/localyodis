import { getLocallyStoredData, storeDataLocally } from "../utils/storage";
import { useEffect, useState } from "react";

import { Source } from "../types/storage";
import { X } from "lucide-react";

type EditSourceModalProps = {
    editingSourceId: string;
    sources: Source[];
    setSources: (sources: Source[]) => void;
    setEditingSource: (id: string | null) => void;
  };
  
  export const EditSourceModal = (props: EditSourceModalProps) => {
    const { editingSourceId, sources, setSources, setEditingSource } = props;
    const [sourceName, setSourceName] = useState("");
    const [sourceColor, setSourceColor] = useState("");
    const [sourceTextColor, setSourceTextColor] = useState("");
  
    const editingSource = sources.find((source) => source.id === editingSourceId);
  
    useEffect(() => {
      if (editingSource) {
        console.log("editingSource.name", editingSource.name);
        console.log("editingSource.color", editingSource.color);
        console.log("editingSource.textColor", editingSource.textColor);
        setSourceName(editingSource.name || "");
        setSourceColor(editingSource.color);
        setSourceTextColor(editingSource.textColor);
      }
    }, [editingSource]);
  
    const handleEditSource = () => {
      const updatedSources = sources.map((source) => {
        if (source.id === editingSourceId) {
          return {
            ...source,
            name: sourceName,
            color: sourceColor,
            textColor: sourceTextColor,
          };
        }
        return source;
      });
      const localData = getLocallyStoredData();
      localData.sources = updatedSources;
      storeDataLocally(localData);
      setSources(updatedSources);
      setEditingSource(null);
    };
  
    return (
      <div className="fixed top-0 left-0 w-full h-full bg-black/80 bg-opacity-50 flex items-center justify-center p-8">
        <div className="bg-white dark:bg-neutral-700 p-8 rounded-md w-full md:w-[500px] flex flex-col">
          <button
            className="self-end cursor-pointer"
            onClick={() => setEditingSource(null)}
          >
            <X className="h-12 w-6 dark:text-white font-bold" />
          </button>
          <h1 className="text-xl  dark:text-white font-bold">Edit Source</h1>
          <div className="flex flex-col gap-4 mt-8">
            <div className="flex flex-col gap-2">
              <label className="text-gray-800 dark:text-gray-400">Name</label>
              <input
                className="w-full p-2 border-2 border-neutral-300 dark:border-neutral-500 rounded-md text-gray-800 dark:text-white"
                value={sourceName}
                type="text"
                onChange={(e) => setSourceName(e.target.value)}
              />
            </div>
            <div className="flex flex-row gap-4 items-center">
              <input
                className="w-[60px] h-[60px] rounded-md"
                value={sourceColor}
                type={"color"}
                onChange={(e) => setSourceColor(e.target.value)}
              />
              <p className="text-gray-800 dark:text-gray-400">Color</p>
            </div>
  
            <div className="flex flex-row gap-4 items-center">
              <input
                className="w-[60px] h-[60px] rounded-m"
                value={sourceTextColor}
                type={"color"}
                onChange={(e) => setSourceTextColor(e.target.value)}
              />
              <p className="text-gray-800 dark:text-gray-400">Text Color</p>
            </div>
          </div>
  
          <div className="flex flex-row gap-4 justify-end">
            <button
              className="font-bold dark:text-white cursor-pointer text-lg py-2 px-6 border-2 border-neutral-300 dark:border-neutral-500 rounded-md mt-8"
              onClick={handleEditSource}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  };