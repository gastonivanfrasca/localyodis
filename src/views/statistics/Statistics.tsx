import { BarChart3, Calendar, Clock, TrendingUp } from "lucide-react";
import { useMemo } from "react";

import { NavigationTitleWithBack } from "../../components/v2/NavigationTitleWithBack";
import { RoundedIdentifier } from "../../components/v2/RoundedIdentifier";
import { calculateSourceStatistics, formatDate, formatDayOfWeek } from "../../utils/statistics";
import { useI18n } from "../../context/i18n";
import { useMainContext } from "../../context/main";

export const Statistics = () => {
  const { state } = useMainContext();
  const { t } = useI18n();

  const statistics = useMemo(() => {
    return calculateSourceStatistics(state.history, state.sources);
  }, [state.history, state.sources]);

  const maxVisitsInWeek = Math.max(...statistics.lastSevenDays.map(day => day.visits), 1);

  if (statistics.totalVisits === 0) {
    return (
      <div className="min-h-dvh bg-white dark:bg-slate-950 text-black dark:text-white font-sans flex flex-col">
        <NavigationTitleWithBack label={t('statistics.title')} />
        
        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-2xl px-6 mt-16 flex flex-col gap-5 py-6">
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-gray-500 dark:text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {t('statistics.empty')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {t('statistics.emptyDescription')}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-white dark:bg-slate-950 text-black dark:text-white font-sans flex flex-col">
      <NavigationTitleWithBack label={t('statistics.title')} />
      
      <div className="flex-1 flex justify-center">
        <div className="w-full max-w-2xl px-6 mt-16 flex flex-col gap-6 py-6">
          
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('statistics.totalVisits')}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{statistics.totalVisits}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('statistics.uniqueSources')}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{statistics.uniqueSources}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Last 7 Days Activity */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('statistics.lastSevenDays')}
              </h3>
            </div>
            
            <div className="flex items-end justify-between gap-2 h-32">
              {statistics.lastSevenDays.map((day, index) => (
                <div key={day.date} className="flex flex-col items-center gap-2 flex-1">
                  <div className="flex flex-col items-center justify-end h-20">
                    {day.visits > 0 && (
                      <div 
                        className="bg-blue-500 dark:bg-blue-400 rounded-t-sm w-full min-h-[4px] transition-all duration-200"
                        style={{ 
                          height: `${(day.visits / maxVisitsInWeek) * 100}%`,
                          minHeight: day.visits > 0 ? '8px' : '0px'
                        }}
                      />
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-medium text-gray-900 dark:text-white">{day.visits}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDayOfWeek(day.date)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Source Rankings */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('statistics.sourceRankings')}
              </h3>
            </div>

            <div className="space-y-3">
              {statistics.sourceStats.map((source, index) => (
                <div key={source.sourceId} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-6">
                        #{index + 1}
                      </span>
                      <RoundedIdentifier
                        color={source.color || '#6B7280'}
                        textColor={source.textColor || '#FFFFFF'}
                        initial={source.initial || source.sourceName[0]?.toUpperCase() || '?'}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">
                        {source.sourceName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {t('statistics.lastVisit')}: {formatDate(source.lastVisit)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-bold text-lg text-gray-900 dark:text-white">
                      {source.totalVisits}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {t('statistics.visits')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Most Active Source */}
          {statistics.mostActiveSource && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                  {t('statistics.mostActiveSource')}
                </h3>
              </div>
              
              <div className="flex items-center gap-3">
                <RoundedIdentifier
                  color={statistics.mostActiveSource.color || '#3B82F6'}
                  textColor={statistics.mostActiveSource.textColor || '#FFFFFF'}
                  initial={statistics.mostActiveSource.initial || statistics.mostActiveSource.sourceName[0]?.toUpperCase() || '?'}
                />
                <div>
                  <p className="font-semibold text-blue-900 dark:text-blue-100">
                    {statistics.mostActiveSource.sourceName}
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    {statistics.mostActiveSource.totalVisits} {t('statistics.visits')} • {formatDate(statistics.mostActiveSource.lastVisit)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
