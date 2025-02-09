import { getLocallyStoredData, storeDataLocally } from "../utils/storage";

import { X } from "lucide-react";
import { checkIfSourceExists } from "../utils/validations";

type AddSourceModalProps = {
  isOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
};

export const AddSourceModal = (props: AddSourceModalProps) => {
  const { isOpen, setIsModalOpen } = props;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = (document.getElementById("rss-name") as HTMLInputElement)
      .value;
    const url = (document.getElementById("rss-url") as HTMLInputElement).value;
    const localData = getLocallyStoredData();
    const sources = localData.sources || [];
    if (checkIfSourceExists(sources, name, url)) {
      alert("Source already exists");
      return;
    }
    sources.push({ name, url });
    storeDataLocally({ ...localData, sources });
    setIsModalOpen(false);
  };

  if (!isOpen) return null;
  return (
    <div className="fixed top-0 left-0 w-full h-screen bg-black opacity-80 flex justify-center items-center">
      <div className="bg-white dark:bg-neutral-800 p-8 rounded-md flex flex-col gap-2 dark:text-white">
        <button
          className="self-end cursor-pointer"
          onClick={() => setIsModalOpen(false)}
        >
          <X className="h-4" />
        </button>
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl  font-bold">Add Source</h1>
          <form className="flex flex-col gap-10" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label>Name</label>
                <input
                  type="text"
                  name="rss-name"
                  id="rss-name"
                  className="p-2 border-2 border-neutral-400 rounded-sm"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label>URL</label>
                <input
                  type="text"
                  name="rss-url"
                  id="rss-url"
                  className="p-2 border-2 border-neutral-400 rounded-sm"
                />
              </div>
            </div>
            <button className="p-2 underline" type="submit">
              Add
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
