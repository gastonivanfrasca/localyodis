import { ActionTypes, useMainContext } from "../context/main";
import { useI18n } from "../context/i18n";
import { useState } from "react";
import { AddCustomSourceSection } from "./v2/AddCustomSourceSection";
import { useError } from "../utils/useError";
import { getLocallyStoredData } from "../utils/storage";
import { checkIfSourceExists } from "../utils/validations";
import { fetchSingleRSS } from "../utils/rss";
import { v4 as uuidv4 } from "uuid";
import { errorMap } from "../utils/errors";

type AddRSSSourceModalsProps = {
  isOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
};

export const AddRSSSourceModals = (props: AddRSSSourceModalsProps) => {
  const { isOpen, setIsModalOpen } = props;
  const { t } = useI18n();
  const { dispatch, state } = useMainContext();
  const { showError } = useError();
  const [rssUrl, setRssUrl] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-slate-600 rounded-2xl p-6 w-11/12 max-w-lg relative shadow-xl">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 cursor-pointer transition-colors"
          onClick={() => setIsModalOpen(false)}
          aria-label={t('a11y.closeModal')}
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

        <h2 className="text-2xl font-bold mb-4">{t('modal.addRss')}</h2>
        <div className="max-h-[70vh] overflow-y-auto pr-1">
          {/* Modo de agregar avanzado: discovery UI */}
          <AddCustomSourceSection onSourceAdded={() => setIsModalOpen(false)} />
          {/* Modo rápido: pegar feed directo */}
          <div className="mt-6 pt-4 border-t border-zinc-200 dark:border-slate-700">
            <label className="block text-sm font-medium mb-2">{t('rss.link')}</label>
            <textarea
              placeholder={t('rss.example')}
              value={rssUrl}
              onChange={(e) => setRssUrl(e.target.value)}
              className="w-full h-20 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 border border-gray-300 dark:border-slate-600 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400 focus:border-transparent mb-4 transition-all"
            />
            <div className="flex justify-end">
              <button
                disabled={!rssUrl}
                onClick={async () => {
                  try {
                    const localData = getLocallyStoredData();
                    const sources = localData.sources || [];
                    if (checkIfSourceExists(sources, rssUrl)) {
                      throw new Error("Source already exists");
                    }
                    const rssData = await fetchSingleRSS(rssUrl, false);
                    let title = rssData.title[0];
                    const bgColor = (Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'));
                    const color = `#${bgColor}`;
                    const r = parseInt(bgColor.substr(0, 2), 16);
                    const g = parseInt(bgColor.substr(2, 2), 16);
                    const b = parseInt(bgColor.substr(4, 2), 16);
                    const textColor = (r * 299 + g * 587 + b * 114) / 1000 >= 128 ? '#000000' : '#ffffff';
                    if (typeof title !== 'string' && typeof title === 'object') {
                      title = title['_'];
                    }
                    const newSource = {
                      name: title,
                      url: rssUrl,
                      type: 'rss',
                      addedOn: new Date().toISOString(),
                      id: uuidv4(),
                      color,
                      textColor,
                      initial: String(title)[0],
                    };
                    sources.push(newSource);
                    dispatch({ type: ActionTypes.SET_SOURCES, payload: sources });
                    dispatch({ type: ActionTypes.SET_ACTIVE_SOURCES, payload: [...state.activeSources, newSource.id] });
                    setIsModalOpen(false);
                    setRssUrl('');
                  } catch {
                    showError(errorMap.sourceModalHandleSubmit);
                  }
                }}
                className="bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900 font-medium py-2.5 px-6 rounded-xl hover:bg-zinc-700 dark:hover:bg-zinc-300 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm tracking-tight"
              >
                {t('modal.addRss')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

type AddYTChannelModalProps = {
  isOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
};

export const AddYTChannelModal = (props: AddYTChannelModalProps) => {
  const { isOpen, setIsModalOpen } = props;
  const [channelName, setChannelName] = useState("");
  const { dispatch, state } = useMainContext();
  const { showError } = useError();
  const { t } = useI18n();
  const handleSubmit = async () => {
    try {
      if (!channelName) {
        throw new Error("Channel name is required");
      }

      const localData = getLocallyStoredData();
      const sources = localData.sources || [];

      if (checkIfSourceExists(sources, channelName)) {
        throw new Error("Source already exists");
      }

      const rssData = await fetchSingleRSS(channelName, true);
      let title = rssData.title[0];
      const bgColor = generateRandomColor();
      const textColor = generateTextColorForBackground(bgColor);

      if (typeof title !== "string") {
        if (typeof title === "object") {
          title = title["_"];
        }
      }

      const newSource = {
        name: title,
        url: rssData.link[0]["$"].href,
        type: "video",
        addedOn: new Date().toISOString(),
        id: uuidv4(),
        color: bgColor,
        textColor: textColor,
        initial: title[0],
      };

      sources.push(newSource);

      dispatch({
        type: ActionTypes.SET_SOURCES,
        payload: sources,
      });

      // Add new source to active sources automatically
      dispatch({
        type: ActionTypes.SET_ACTIVE_SOURCES,
        payload: [...state.activeSources, newSource.id],
      });
    } catch {
      showError(errorMap.sourceModalHandleSubmit);  
    }
    setIsModalOpen(false);
    setChannelName("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-slate-600 rounded-2xl p-6 w-11/12 max-w-md relative shadow-xl">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 cursor-pointer transition-colors"
          onClick={() => setIsModalOpen(false)}
          aria-label={t('a11y.closeModal')}
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

        <h2 className="text-2xl font-bold mb-6">{t('modal.addYoutube')}</h2>

        {/* Channel name input */}
        <label className="block text-sm font-medium mb-2">{t('youtube.channelName')}</label>
        <textarea
          placeholder={t('youtube.example')}
          value={channelName}
          onChange={(e) => setChannelName(e.target.value)}
          className="w-full h-24 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 border border-gray-300 dark:border-slate-600 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400 focus:border-transparent mb-6 transition-all"
        />

        {/* Add button */}
        <div className="flex justify-end">
          <button
            disabled={!channelName}
            onClick={handleSubmit}
            className="bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900 font-medium py-2.5 px-6 rounded-xl hover:bg-zinc-700 dark:hover:bg-zinc-300 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm tracking-tight"
          >
            {t('youtube.add')}
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
