// Install Banner Component for LocalYodis
// Shows Play Store installation prompt instead of PWA

import React, { useEffect, useState } from 'react';

import { useInstallationControl } from '../utils/installation-control';

const InstallBanner: React.FC = () => {
  const { 
    context, 
    isPWA, 
    isTWA, 
    redirectToPlayStore, 
    shouldShowInstallPrompt,
    trackInstallationAttempt 
  } = useInstallationControl();

  const [showBanner, setShowBanner] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Only show banner if running in browser and not dismissed
    const wasDismissed = localStorage.getItem('install_banner_dismissed') === 'true';
    
    if (shouldShowInstallPrompt && !wasDismissed && context === 'browser') {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [shouldShowInstallPrompt, context]);

  const handleInstallClick = () => {
    trackInstallationAttempt('play_store');
    redirectToPlayStore();
    handleDismiss();
  };

  const handleDismiss = () => {
    setShowBanner(false);
    setDismissed(true);
    localStorage.setItem('install_banner_dismissed', 'true');
  };

  // Don't render if running as PWA or TWA
  if (isPWA || isTWA || !showBanner || dismissed) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 shadow-lg z-50 animate-slide-up">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
            <img 
              src="/logo.png" 
              alt="LocalYodis" 
              className="w-8 h-8"
            />
          </div>
          <div>
            <h3 className="font-semibold text-lg">
              Instalar LocalYodis
            </h3>
            <p className="text-blue-100 text-sm">
              Obtén la mejor experiencia con nuestra aplicación desde Google Play Store
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={handleInstallClick}
            className="bg-white text-blue-600 font-semibold px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors flex items-center space-x-2"
          >
            <svg 
              className="w-5 h-5" 
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.92 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
            </svg>
            <span>Instalar</span>
          </button>
          
          <button
            onClick={handleDismiss}
            className="text-blue-100 hover:text-white transition-colors p-2"
            aria-label="Cerrar"
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallBanner;
