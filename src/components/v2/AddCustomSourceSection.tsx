import { ActionTypes, useMainContext } from "../../context/main";
import { Link, Plus, Search } from "lucide-react";

import { isValidHttpUrl } from "../../utils/validations";
import { useError } from "../../utils/useError";
import { useI18n } from "../../context/i18n";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { discoverFeedsFromSite } from "../../utils/rss";
import type { DiscoveredFeed } from "../../types/rss-discovery";

type AddCustomSourceSectionProps = {
  onSourceAdded?: () => void;
};

const generateRandomColor = () => {
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);
  return "#" + randomColor.padStart(6, "0");
};

const generateTextColorForBackground = (bgColor: string) => {
  const r = parseInt(bgColor.substr(1, 2), 16);
  const g = parseInt(bgColor.substr(3, 2), 16);
  const b = parseInt(bgColor.substr(5, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 125 ? "#000000" : "#ffffff";
};

export const AddCustomSourceSection = ({ onSourceAdded }: AddCustomSourceSectionProps) => {
  const { t } = useI18n();
  const { dispatch, state } = useMainContext();
  const { showError } = useError();

  const [rssUrl, setRssUrl] = useState("");
  const [customName, setCustomName] = useState("");
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [discoveredFeeds, setDiscoveredFeeds] = useState<DiscoveredFeed[]>([]);

  const isLikelyFeedUrl = (url: string): boolean => {
    if (!isValidHttpUrl(url)) return false;
    return /(\/feed(\/)?$|\.(xml|rss|atom)(\?|$))/i.test(url);
  };

  const handleAddSource = () => {
    if (!rssUrl.trim() || !isValidHttpUrl(rssUrl)) {
      showError("Please enter a valid RSS URL", "warning");
      return;
    }

    const existingSource = state.sources.find(source => source.url === rssUrl);
    if (existingSource) {
      showError("Source already exists!", "warning");
      return;
    }

    const bgColor = generateRandomColor();
    const textColor = generateTextColorForBackground(bgColor);
    const sourceId = uuidv4();

    let sourceName = customName.trim();
    if (!sourceName) {
      try {
        const url = new URL(rssUrl);
        sourceName = url.hostname;
      } catch {
        sourceName = "Custom Source";
      }
    }

    const newSource = {
      name: sourceName,
      url: rssUrl,
      type: "rss",
      addedOn: new Date().toISOString(),
      id: sourceId,
      color: bgColor,
      textColor: textColor,
      initial: sourceName[0].toUpperCase(),
    };

    dispatch({
      type: ActionTypes.SET_SOURCES,
      payload: [...state.sources, newSource],
    });

    dispatch({
      type: ActionTypes.SET_ACTIVE_SOURCES,
      payload: [...state.activeSources, sourceId],
    });

    showError("Source added successfully!", "success");
    setRssUrl("");
    setCustomName("");
    onSourceAdded?.();
  };

  const handleDiscover = async () => {
    if (!rssUrl.trim() || !isValidHttpUrl(rssUrl)) {
      showError("Please enter a valid website URL", "warning");
      return;
    }
    setIsDiscovering(true);
    setDiscoveredFeeds([]);
    try {
      const feeds = await discoverFeedsFromSite(rssUrl.trim());
      setDiscoveredFeeds(feeds);
      if (feeds.length === 0) {
        showError("No feeds found for this site", "warning");
      }
    } catch {
      showError("Failed to discover feeds", "error");
    } finally {
      setIsDiscovering(false);
    }
  };

  

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="bg-zinc-200 dark:bg-slate-800 p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-600 flex-shrink-0">
          <Link className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-zinc-800 dark:text-white tracking-tight">
            {t('sources.addCustom')}
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
            {t('sources.addCustomSubtitle')}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
            {t('sources.url')} <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            value={rssUrl}
            onChange={(e) => setRssUrl(e.target.value)}
            placeholder="https://example.com/feed.xml"
            className="w-full bg-zinc-100 dark:bg-slate-800 text-zinc-900 dark:text-zinc-100 border-2 border-zinc-300 dark:border-zinc-700 rounded-xl p-3 focus:outline-none focus:ring-4 focus:ring-zinc-500/20 focus:border-zinc-500 dark:focus:border-zinc-400 transition-all duration-200"
          />
          <div className="flex gap-2 mt-3">
            <button
              type="button"
              onClick={handleDiscover}
              disabled={!rssUrl.trim() || isDiscovering}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-200 dark:bg-slate-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-300 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              <Search className="w-4 h-4" />
              {isDiscovering ? t('common.loading') : t('sources.discoverFeeds')}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
            {t('sources.customName')} ({t('sources.optional')})
          </label>
          <input
            type="text"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder={t('sources.customNamePlaceholder')}
            className="w-full bg-zinc-100 dark:bg-slate-800 text-zinc-900 dark:text-zinc-100 border-2 border-zinc-300 dark:border-zinc-700 rounded-xl p-3 focus:outline-none focus:ring-4 focus:ring-zinc-500/20 focus:border-zinc-500 dark:focus:border-zinc-400 transition-all duration-200"
          />
           <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
            {t('sources.customNameHelp')}
          </p>
        </div>
      </div>

      {discoveredFeeds.length > 0 && (
        <div className="pt-2">
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">{t('sources.discoveredFeeds')}</p>
          <ul className="space-y-2">
            {discoveredFeeds.map((feed) => {
              const exists = state.sources.some((s) => s.url === feed.url);
              return (
                <li key={feed.url} className="flex items-center justify-between gap-3 bg-zinc-100 dark:bg-slate-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100 truncate">{feed.title || feed.url}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{feed.url}</p>
                  </div>
                  <button
                    type="button"
                    disabled={exists}
                    onClick={() => {
                      setRssUrl(feed.url);
                      setCustomName((prev) => prev || (feed.title ?? ""));
                    }}
                    className="px-3 py-2 text-xs font-semibold rounded-lg bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900 disabled:opacity-50"
                  >
                    {exists ? t('sources.alreadyExists') : t('common.continue')}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <button
          onClick={handleAddSource}
          disabled={!rssUrl.trim() || !(isLikelyFeedUrl(rssUrl) || discoveredFeeds.length > 0)}
          className="flex-1 flex items-center justify-center gap-3 bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900 font-semibold py-3 px-5 rounded-xl hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-5 h-5" />
          <span>{t('sources.addCustomSource')}</span>
        </button>
      </div>
    </div>
  );
}; 