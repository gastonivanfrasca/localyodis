// Debug Context Component for LocalYodis
// Shows app context information for debugging TWA detection

import React, { useEffect, useState } from 'react';
import {
  getAppContext,
  isAndroidMobileBrowser,
  isInstalledAndroidApp,
  isStandalonePWA,
  isTrustedWebActivity,
  shouldShowMobileLanding
} from '../utils/device';

interface DebugContextProps {
  show?: boolean;
}

const DebugContext: React.FC<DebugContextProps> = ({ show = false }) => {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const info = {
      appContext: getAppContext(),
      detection: {
        isTWA: isTrustedWebActivity(),
        isInstalledAndroid: isInstalledAndroidApp(),
        isStandalonePWA: isStandalonePWA(),
        isAndroidMobile: isAndroidMobileBrowser(),
        shouldShowMobile: shouldShowMobileLanding()
      },
      environment: {
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        protocol: window.location.protocol,
        host: window.location.host,
        pathname: window.location.pathname,
        search: window.location.search
      },
      viewport: {
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        outerWidth: window.outerWidth,
        outerHeight: window.outerHeight,
        isFullscreen: window.outerHeight === window.innerHeight && window.outerWidth === window.innerWidth
      },
      performance: window.performance?.navigation ? {
        type: window.performance.navigation.type,
        redirectCount: window.performance.navigation.redirectCount
      } : null
    };

    setDebugInfo(info);
  }, []);

  // Enable debug mode with Ctrl+Shift+D
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        setIsVisible(!isVisible);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible]);

  if (!isVisible || !debugInfo) {
    return null;
  }

  const getStatusColor = (value: boolean) => {
    return value ? 'text-green-600' : 'text-red-600';
  };

  const getContextColor = (context: string) => {
    switch (context) {
      case 'twa':
      case 'installed-android':
        return 'text-green-600 font-bold';
      case 'android-browser':
        return 'text-orange-600';
      case 'pwa':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="fixed top-4 left-4 right-4 bg-black/90 text-white p-4 rounded-lg z-50 max-h-96 overflow-y-auto text-xs font-mono">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-bold text-yellow-400">
          LocalYodis Debug Context
        </h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-white hover:text-red-400"
        >
          ✕
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <div className="text-yellow-300 font-bold mb-1">App Context:</div>
          <div className={getContextColor(debugInfo.appContext)}>
            {debugInfo.appContext.toUpperCase()}
          </div>
        </div>

        <div>
          <div className="text-yellow-300 font-bold mb-1">Detection Results:</div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-gray-300">TWA:</span>{' '}
              <span className={getStatusColor(debugInfo.detection.isTWA)}>
                {debugInfo.detection.isTWA ? 'YES' : 'NO'}
              </span>
            </div>
            <div>
              <span className="text-gray-300">Android App:</span>{' '}
              <span className={getStatusColor(debugInfo.detection.isInstalledAndroid)}>
                {debugInfo.detection.isInstalledAndroid ? 'YES' : 'NO'}
              </span>
            </div>
            <div>
              <span className="text-gray-300">PWA:</span>{' '}
              <span className={getStatusColor(debugInfo.detection.isStandalonePWA)}>
                {debugInfo.detection.isStandalonePWA ? 'YES' : 'NO'}
              </span>
            </div>
            <div>
              <span className="text-gray-300">Android Mobile:</span>{' '}
              <span className={getStatusColor(debugInfo.detection.isAndroidMobile)}>
                {debugInfo.detection.isAndroidMobile ? 'YES' : 'NO'}
              </span>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-gray-300">Should Show Mobile:</span>{' '}
            <span className={getStatusColor(debugInfo.detection.shouldShowMobile)}>
              {debugInfo.detection.shouldShowMobile ? 'YES' : 'NO'}
            </span>
          </div>
        </div>

        <div>
          <div className="text-yellow-300 font-bold mb-1">Environment:</div>
          <div className="space-y-1">
            <div><span className="text-gray-300">URL:</span> {debugInfo.environment.host}{debugInfo.environment.pathname}</div>
            <div><span className="text-gray-300">Referrer:</span> {debugInfo.environment.referrer || 'None'}</div>
            <div><span className="text-gray-300">Protocol:</span> {debugInfo.environment.protocol}</div>
          </div>
        </div>

        <div>
          <div className="text-yellow-300 font-bold mb-1">User Agent:</div>
          <div className="text-gray-300 break-all">
            {debugInfo.environment.userAgent}
          </div>
        </div>

        <div>
          <div className="text-yellow-300 font-bold mb-1">Viewport:</div>
          <div className="grid grid-cols-2 gap-2">
            <div>Inner: {debugInfo.viewport.innerWidth} × {debugInfo.viewport.innerHeight}</div>
            <div>Outer: {debugInfo.viewport.outerWidth} × {debugInfo.viewport.outerHeight}</div>
          </div>
          <div>
            <span className="text-gray-300">Fullscreen:</span>{' '}
            <span className={getStatusColor(debugInfo.viewport.isFullscreen)}>
              {debugInfo.viewport.isFullscreen ? 'YES' : 'NO'}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-gray-700 text-gray-400 text-xs">
        Press Ctrl+Shift+D to toggle • App will only work on installed Android app
      </div>
    </div>
  );
};

export default DebugContext;
