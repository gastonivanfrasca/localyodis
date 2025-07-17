import { AddCustomSourceSection } from "../../components/v2/AddCustomSourceSection";
import { GoogleNewsRSSBuilder } from "../../components/v2/GoogleNewsRSSBuilder";
import { Settings } from "lucide-react";
import { useI18n } from "../../context/i18n";
import { useMainContext } from "../../context/main";
import { useNavigate } from "react-router";

export const FirstTimeUser = () => {
  const navigate = useNavigate();
  const { state } = useMainContext();
  const { t } = useI18n();

  const handleFinishSetup = () => {
    // Navigate to home
    navigate("/");
  };

  // Count Google News sources that have been added
  const googleNewsSources = state.sources.filter(source => 
    source.name && source.name.startsWith('GN - ')
  );
  const googleNewsCount = googleNewsSources.length;

  // Count total sources
  const totalSources = state.sources.length;

  // Check if we have any sources to enable continue
  const canContinue = totalSources > 0;

  return (
    <div className="w-full h-screen dark:bg-slate-950 flex flex-col">
      {/* Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex-shrink-0 px-6 py-6 border-b border-zinc-200 dark:border-zinc-800">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-zinc-800 dark:text-white tracking-tight mb-3">
              {t('ftu.welcome')}
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 text-base max-w-2xl mx-auto">
              {t('ftu.googleNewsDescription')}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-8 space-y-12">
            
            {/* Google News RSS Builder */}
            <section>
              <GoogleNewsRSSBuilder />
            </section>

            {/* Divider */}
            <div className="border-t border-zinc-200 dark:border-zinc-800"></div>

            {/* Custom Source Section */}
            <section>
              <AddCustomSourceSection />
            </section>

            {/* Added Sources Summary */}
            {totalSources > 0 && (
              <section className="bg-zinc-50 dark:bg-slate-800/30 border border-zinc-200 dark:border-zinc-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-3">
                  {t('ftu.sourcesAdded')}
                </h3>
                <div className="space-y-3">
                  {googleNewsCount > 0 && (
                    <div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                        📰 {googleNewsCount} Google News {googleNewsCount === 1 ? t('ftu.sourceAdded') : t('ftu.sourcesAddedPlural')}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {googleNewsSources.map((source, index) => (
                          <span 
                            key={index}
                            className="inline-flex items-center gap-2 px-3 py-1 bg-white dark:bg-slate-800 text-zinc-800 dark:text-zinc-200 rounded-lg text-sm font-medium border border-zinc-200 dark:border-zinc-600"
                          >
                            <div 
                              className="w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold"
                              style={{ 
                                backgroundColor: source.color, 
                                color: source.textColor 
                              }}
                            >
                              {source.initial}
                            </div>
                            {source.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {state.sources.filter(s => !s.name?.startsWith('GN - ')).length > 0 && (
                    <div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                        🔗 {state.sources.filter(s => !s.name?.startsWith('GN - ')).length} Custom sources
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {state.sources.filter(s => !s.name?.startsWith('GN - ')).map((source, index) => (
                          <span 
                            key={index}
                            className="inline-flex items-center gap-2 px-3 py-1 bg-white dark:bg-slate-800 text-zinc-800 dark:text-zinc-200 rounded-lg text-sm font-medium border border-zinc-200 dark:border-zinc-600"
                          >
                            <div 
                              className="w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold"
                              style={{ 
                                backgroundColor: source.color, 
                                color: source.textColor 
                              }}
                            >
                              {source.initial}
                            </div>
                            {source.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Instructions */}
            {totalSources === 0 && (
              <section className="text-center py-8">
                <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                  {t('ftu.noSourcesYet')}
                </p>
              </section>
            )}

          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 px-6 py-6 border-t border-zinc-300 dark:border-zinc-800 bg-white dark:bg-slate-950">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <button
            onClick={() => {
              navigate("/settings");
            }}
            className="bg-zinc-200 dark:bg-slate-800 p-2.5 rounded-xl hover:bg-zinc-300 dark:hover:bg-slate-700 transition-all duration-200"
          >
            <Settings className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
          </button>
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              {totalSources > 0 ? (
                <span className="text-zinc-700 dark:text-zinc-300">
                  {totalSources} {totalSources === 1 ? t('ftu.sourceReady') : t('ftu.sourcesReady')}
                </span>
              ) : (
                t('ftu.addInterests')
              )}
            </span>
            <button
              onClick={handleFinishSetup}
              disabled={!canContinue}
              className="bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900 font-medium py-2.5 px-6 rounded-xl hover:bg-zinc-700 dark:hover:bg-zinc-300 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm tracking-tight"
            >
              {t('common.continue')} {totalSources > 0 && `(${totalSources})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 