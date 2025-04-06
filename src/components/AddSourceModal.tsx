import { getLocallyStoredData, storeDataLocally } from "../utils/storage";

import { Source } from "../types/storage";
import { checkIfSourceExists } from "../utils/validations";
import { fetchSingleRSS } from "../utils/rss";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

type AddSourceModalProps = {
  isOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  setSources: (sources: Source[]) => void;
  setLoading: (loading: boolean) => void;
};

export const AddSourceModal = (props: AddSourceModalProps) => {
  const { isOpen, setIsModalOpen, setSources, setLoading } = props;
  const [sourceType, setSourceType] = useState("rss");
  const [identifier, setIdentifier] = useState("");

  const handleSubmit = async () => {
    setLoading(true);

    const video = sourceType === "youtube";

    try {
      if (!identifier) {
        throw new Error("Identifier is required");
      }

      const localData = getLocallyStoredData();
      const sources = localData.sources || [];
      if (checkIfSourceExists(sources, identifier)) {
        throw new Error("Source already exists");
      }

      const rssData = await fetchSingleRSS(identifier, video);
      let title = rssData.title[0];
      const bgColor = generateRandomColor();
      const textColor = generateTextColorForBackground(bgColor);

      if (typeof title !== "string") {
        if (typeof title === "object") {
          title = title["_"];
        }
      }

      sources.push({
        name: title,
        url: video ? rssData.link[0]["$"].href : identifier,
        type: video ? "video" : "rss",
        addedOn: new Date().toISOString(),
        id: uuidv4(),
        color: bgColor,
        textColor: textColor,
        initial: title[0],
      });

      storeDataLocally({ ...localData, sources });
      setSources([...sources]);
    } catch (error) {
      // TODO: Show error to user
      console.error(error);
    } finally {
      setLoading(false);
      setIsModalOpen(false);
      setIdentifier("");
      setSourceType("rss");
    }
  };

  const getPlaceholder = () => {
    return sourceType === "rss"
      ? "e.g. https://example.com/feed.xml"
      : "e.g. Example name";
  };

  const getTitle = () => {
    return sourceType === "rss" ? "RSS link" : "Channel name";
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-slate-950/80 flex items-center justify-center z-50">
      <div className="bg-slate-950 dark:bg-white text-white dark:text-black rounded-2xl p-6 w-11/12 max-w-md relative shadow-xl transition-colors">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-inherit hover:opacity-80 cursor-pointer"
          onClick={() => setIsModalOpen(false)}
          aria-label="Close modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 className="text-2xl font-bold mb-6">Add Source</h2>

        {/* URL input */}
        <label className="block text-sm font-medium mb-2">{getTitle()}</label>
        <textarea
          placeholder={getPlaceholder()}
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className="w-full h-24 bg-zinc-800 dark:bg-zinc-100 dark:text-black dark:placeholder-zinc-500 border border-zinc-500 rounded-lg p-3 text-white placeholder-zinc-400 resize-none focus:outline-none focus:ring-2 focus:ring-white dark:focus:ring-black focus:border-transparent mb-6 transition-all"
        />

        {/* Type selection */}
        <div className="flex justify-end gap-4 mb-6">
          <button
            onClick={() => setSourceType("rss")}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border border-zinc-500 transition ${
              sourceType === "rss"
                ? "bg-zinc-800 text-white dark:bg-zinc-200 dark:text-black"
                : "hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-black"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 4.5a15.9 15.9 0 0115 15m-15-7.5a8.4 8.4 0 017.5 7.5m-7.5 0h.008v.008H4.5V19.5z"
              />
            </svg>
            <span className="text-sm font-medium">RSS</span>
          </button>

          <button
            onClick={() => setSourceType("youtube")}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border border-zinc-500 transition ${
              sourceType === "youtube"
                ? "bg-zinc-800 text-white dark:bg-zinc-200 dark:text-black"
                : "hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-black"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="w-5 h-5"
            >
              <path d="M10 15.5l6-3.5-6-3.5v7zm11.5-7.7s-.2-1.4-.8-2c-.8-.8-1.6-.8-2-1C16.7 4 12 4 12 4h0s-4.7 0-6.7.3c-.5.2-1.3.2-2 1-.6.6-.8 2-.8 2S2 9.3 2 11v2c0 1.7.2 3.2.2 3.2s.2 1.4.8 2c.8.8 1.9.8 2.4.9C7.3 19.9 12 20 12 20s4.7 0 6.7-.3c.5-.2 1.3-.2 2-1 .6-.6.8-2 .8-2s.2-1.5.2-3.2v-2c0-1.7-.2-3.2-.2-3.2z" />
            </svg>
            <span className="text-sm font-medium">YT Channel</span>
          </button>
        </div>

        {/* Add button */}
        <div className="flex justify-end">
          <button
            disabled={!identifier}
            onClick={handleSubmit}
            className="bg-white text-black font-bold py-2 px-6 rounded-lg border border-zinc-500 hover:bg-zinc-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

const generateRandomColor = () => {
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);
  return "#" + randomColor.padStart(6, "0");
};

const generateTextColorForBackground = (bgColor: string) => {
  const color = bgColor.replace("#", "");
  const r = parseInt(color.substr(0, 2), 16);
  const g = parseInt(color.substr(2, 2), 16);
  const b = parseInt(color.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness >= 128 ? "#000000" : "#ffffff";
};
