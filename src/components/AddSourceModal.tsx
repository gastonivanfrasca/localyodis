import { getLocallyStoredData, storeDataLocally } from "../utils/storage";

import { X } from "lucide-react";
import { checkIfSourceExists } from "../utils/validations";
import { fetchSingleRSS } from "../utils/rss";
import { v4 as uuidv4 } from "uuid";

type AddSourceModalProps = {
  isOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
};

export const AddSourceModal = (props: AddSourceModalProps) => {
  const { isOpen, setIsModalOpen } = props;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const url = (document.getElementById("rss-url") as HTMLInputElement)
        .value;
      if (!url) {
        throw new Error("Name and URL are required");
      }
      const localData = getLocallyStoredData();
      const sources = localData.sources || [];
      if (checkIfSourceExists(sources, url)) {
        throw new Error("Source already exists");
      }

      const rssData = await fetchSingleRSS(url);
      const title = rssData.title;
      const image = rssData.image[0].url[0] || "placeholder";
      const description = rssData.description;

      console.log({ title, image, description });
      sources.push({
        name: title,
        url,
        addedOn: new Date().toISOString(),
        id: uuidv4(),
        image: image,
        description,
      });
      storeDataLocally({ ...localData, sources });
      setIsModalOpen(false);
    } catch (error) {
      // TODO: Show error to user
      console.error(error);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed top-0 left-0 w-full h-screen bg-black  flex justify-center items-center p-8">
      <div className="bg-white dark:bg-neutral-800 p-8 rounded-md flex flex-col gap-2 dark:text-white w-full md:max-w-[600px]">
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
                <label>URL</label>
                <input
                  type="text"
                  name="rss-url"
                  id="rss-url"
                  className="p-2 border-2 border-neutral-400 rounded-sm"
                />
              </div>
            </div>
            <button className="p-2 underline cursor-pointer" type="submit">
              Add
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
