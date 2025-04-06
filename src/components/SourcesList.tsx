import { AddSourceButton } from "./v2/AddSourceButton";
import { EditSourceModal } from "./EditSourceModal";
import { Source } from "../types/storage";
import { SourceItem } from "./v2/SourceItem";
import { getLocallyStoredData } from "../utils/storage";
import { removeSourceFromLocalData } from "../utils/storage";
import { useState } from "react";

type SourcesListProps = {
  sources: Source[];
  setSources: (sources: Source[]) => void;
  setIsModalOpen: (value: boolean) => void;
};

export const SourcesList = (props: SourcesListProps) => {
  const { sources, setSources, setIsModalOpen } = props;
  const [editingSource, setEditingSource] = useState<string | null>(null);

  const handleRemoveSource = (id: string) => {
    removeSourceFromLocalData(id);
    const localData = getLocallyStoredData();
    setSources([...localData.sources]);
  };

  if (sources.length === 0) {
    return <p className="dark:text-gray-200">No sources added yet</p>;
  }
  return (
    <div className="flex flex-col gap-10 md:items-center overflow-scroll">
      <h1 className=" text-2xl font-bold dark:text-white self-start">
        Sources
      </h1>
      <AddSourceButton onClick={() => setIsModalOpen(true)} />
      <div className="flex flex-col gap-4 w-full overflow-scroll">
        {sources.map((source) => (
          <SourceItem
            color={source.color}
            textColor={source.textColor}
            initial={source.initial}
            video={source.type === "video"}
            name={source.name || source.url}
            key={source.id}
            trashCanCallback={() => handleRemoveSource(source.id)}
          />
        ))}
      </div>
      {editingSource && (
        <EditSourceModal
          editingSourceId={editingSource}
          sources={sources}
          setSources={setSources}
          setEditingSource={setEditingSource}
        />
      )}
    </div>
  );
};
