import { Check, Eraser, ListChecks, X } from "lucide-react"; // Import X and ListChecks icons
import { useState } from "react"; // Import useState

import { Navigations } from "../types/navigation";
import { RoundedIdentifier } from "./v2/RoundedIdentifier";
import { Source } from "../types/storage";

type FilterSourcesModalProps = {
  allSources: Source[];
  activeSources: string[];
  setActiveSources: (value: string[]) => void;
  setNavigation: (value: Navigations) => void;
};

export const FilterSourcesModal = (props: FilterSourcesModalProps) => {
  const { activeSources, setActiveSources, allSources, setNavigation } = props;
  // Local state to hold temporary filter selections
  const [selectedFilters, setSelectedFilters] = useState<string[]>([...activeSources]);

  const handleConfirm = () => {
    setActiveSources(selectedFilters); // Apply filters by calling parent state setter
    // Persistence should be handled by the parent component where setActiveSources originates
    setNavigation(Navigations.HOME); // Close modal
  };

  const handleClose = () => {
    setNavigation(Navigations.HOME); // Close modal without applying changes
  };

  return (
    // Use AddSourceModal styles for consistency and add onClick to close on overlay click
    <div
      className="fixed inset-0 bg-slate-900/80 flex items-center justify-center z-50 p-4" // Added padding
      onClick={handleClose} // Close modal on overlay click
    >
      {/* Use AddSourceModal styles and stop propagation */}
      <div
        className="bg-white dark:bg-slate-950 text-black dark:text-white rounded-2xl p-6 w-11/12 max-w-md relative shadow-xl transition-colors z-10"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        {/* Add Close button like in AddSourceModal */}
        <button
          className="absolute top-4 right-4 text-inherit hover:opacity-80 cursor-pointer"
          onClick={handleClose}
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center">Filter Sources</h2> {/* Use AddSourceModal title style */}
        <div className="flex flex-col gap-4 mt-4 max-h-60 overflow-y-auto pr-2"> {/* Added max height and scroll */}
          {allSources.map((source) => {
            return (
              <div key={source.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="cursor-pointer rounded-sm p-4 dark:bg-neutral-700 accent-gray-800 dark:accent-gray-800 w-4 h-4"
                  id={source.id}
                  checked={selectedFilters.includes(source.id)} // Check against local state
                  onChange={(e) => {
                    // Update local state instead of directly calling setActiveSources
                    if (e.target.checked) {
                      setSelectedFilters([...selectedFilters, source.id]);
                    } else {
                      setSelectedFilters(
                        selectedFilters.filter((id) => id !== source.id)
                      );
                    }
                  }}
                />
                <label
                  htmlFor={source.id}
                  className="flex flex-row items-center gap-2 cursor-pointer" // Added cursor-pointer
                >
                  <RoundedIdentifier
                    color={source.color}
                    textColor={source.textColor}
                    initial={source.initial}
                    video={source.type === "video"}
                    small
                  />
                  {/* Ensure text doesn't overflow */}
                  <p className="truncate flex-1 min-w-0">{source.name}</p>
                </label>
              </div>
            );
          })}
        </div>
        {/* Updated button layout */}
        <div className="flex flex-row justify-end mt-8 gap-4 items-center"> {/* Added items-center */}
           {/* Select All Button */}
           <button
            title="Select All" // Added title for accessibility
            className="p-2 rounded-lg border border-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition"
            onClick={() =>
              setSelectedFilters(allSources.map((source) => source.id))
            }
          >
            <ListChecks className="w-5 h-5"/>
          </button>
          {/* Deselect All Button */}
          <button
            title="Deselect All" // Added title for accessibility
            className="p-2 rounded-lg border border-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition"
            onClick={() => setSelectedFilters([])} // Set local state to empty array
          >
            <Eraser className="w-5 h-5"/>
          </button>
          {/* Confirm Button */}
          <button
            className="bg-black dark:bg-white text-white dark:text-black font-bold py-2 px-6 rounded-lg border border-zinc-500 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition flex items-center gap-2" // Added styles like AddSourceModal
            onClick={handleConfirm} // Call handleConfirm on click
          >
            <Check className="w-5 h-5"/> Confirm
          </button>
        </div>
      </div>
    </div>
  );
};
