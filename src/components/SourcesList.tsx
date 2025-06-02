import { Source } from "../types/storage";
import { SourceItem } from "./v2/SourceItem";

type SourcesListProps = {
  sources: Source[];
  setSources: (sources: Source[]) => void;
};

export const SourcesList = (props: SourcesListProps) => {
  const { sources, setSources } = props;

  const handleRemoveSource = (id: string) => {
    setSources([...sources.filter((source) => source.id !== id)]);
  };

  if (sources.length === 0) {
    return <p className="dark:text-gray-200">No sources added yet</p>;
  }
  return (

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
  );
};
