import { Search } from "lucide-react";
import { Source } from "../types/storage";
import { SourceItem } from "./v2/SourceItem";
import { useState } from "react";

type SourcesListProps = {
  sources: Source[];
  setSources: (sources: Source[]) => void;
};

export const SourcesList = (props: SourcesListProps) => {
  const { sources, setSources } = props;
  const [searchQuery, setSearchQuery] = useState("");

  const handleRemoveSource = (id: string) => {
    setSources([...sources.filter((source) => source.id !== id)]);
  };

  const filteredSources = sources.filter((source) => {
    const sourceName = source.name || source.url;
    return sourceName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (sources.length === 0) {
    return <p className="dark:text-gray-200">No sources added yet</p>;
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="relative w-full max-w-md mx-auto">
        <input
          type="text"
          placeholder="Search sources..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                     placeholder-gray-500 dark:placeholder-gray-400 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
      </div>

      {/* Sources List */}
      <div className="flex flex-col gap-4 w-full overflow-scroll">
        {filteredSources.length === 0 && searchQuery ? (
          <p className="dark:text-gray-400 text-center py-4">
            No sources found matching "{searchQuery}"
          </p>
        ) : (
          filteredSources.map((source) => (
            <SourceItem
              color={source.color}
              textColor={source.textColor}
              initial={source.initial}
              video={source.type === "video"}
              name={source.name || source.url}
              key={source.id}
              trashCanCallback={() => handleRemoveSource(source.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};
