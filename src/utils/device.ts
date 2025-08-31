export const isAndroidMobileBrowser = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  const userAgent = navigator.userAgent || (navigator as unknown as { vendor?: string }).vendor || (window as unknown as { opera?: string }).opera || '';
  const isAndroid = /Android/i.test(userAgent);
  const isMobile = /Mobile/i.test(userAgent);
  return isAndroid && isMobile;
};

export const isMobileBrowser = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  const userAgent = navigator.userAgent || (navigator as unknown as { vendor?: string }).vendor || (window as unknown as { opera?: string }).opera || '';
  return /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
};

export const isStandalonePWA = (): boolean => {
  if (typeof window === 'undefined') return false;
  const matchMediaStandalone = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
  const navigatorStandalone = (navigator as unknown as { standalone?: boolean }).standalone === true; // iOS
  return Boolean(matchMediaStandalone || navigatorStandalone);
};

// Real TWA detection based on Digital Asset Links and Google Play Store validation
export const isTrustedWebActivity = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Primary check: TWA-specific referrer pattern
  if (document.referrer.includes('android-app://')) {
    return true;
  }
  
  // Secondary check: Android WebView in standalone mode (real TWA)
  const isAndroidWebView = navigator.userAgent.includes('Android') && 
                          navigator.userAgent.includes('wv');
  
  const isStandaloneMode = window.matchMedia && 
                          window.matchMedia('(display-mode: standalone)').matches;
  
  // Real TWA runs in WebView + standalone mode + Android
  if (isAndroidWebView && isStandaloneMode) {
    return true;
  }
  
  return false;
};

// Digital Asset Links verification - checks if app has proper Play Store validation
export const hasValidDigitalAssetLinks = async (): Promise<boolean> => {
  try {
    // Check if our Digital Asset Links are accessible
    const assetLinksUrl = `${window.location.origin}/.well-known/assetlinks.json`;
    const response = await fetch(assetLinksUrl);
    
    if (!response.ok) return false;
    
    const assetLinks = await response.json();
    
    // Verify our app package is in the asset links
    const hasOurPackage = assetLinks.some((link: { target?: { package_name?: string } }) => 
      link.target?.package_name === 'app.vercel.localyodis.twa'
    );
    
    return hasOurPackage;
  } catch {
    return false;
  }
};

// Check for Google Play Store installation context
export const isPlayStoreInstallation = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Check for Play Store specific indicators
  const playStoreIndicators = [
    // No browser referrer (direct app launch)
    document.referrer === '',
    
    // Android device
    navigator.userAgent.includes('Android'),
    
    // Standalone PWA mode (how TWA appears)
    isStandalonePWA(),
    
    // HTTPS (required for TWA)
    window.location.protocol === 'https:',
    
    // No browser-specific URL params
    !window.location.search.includes('utm_source=browser'),
    !window.location.search.includes('source=bookmark'),
    !window.location.search.includes('source=homescreen'),
    
    // Clean URL (no tracking params that browsers add)
    window.location.pathname === '/' || window.location.pathname === '',
    window.location.search === '' || !window.location.search.includes('source=')
  ];
  
  // All indicators must be true for Play Store installation
  return playStoreIndicators.every(Boolean);
};

// Real detection for installed Android app from Google Play Store
export const isInstalledAndroidApp = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Primary: True TWA from Play Store
  if (isTrustedWebActivity()) {
    return true;
  }
  
  // Secondary: Play Store installation context
  if (isPlayStoreInstallation()) {
    return true;
  }
  
  return false;
};

// Advanced TWA verification using multiple Google Play Store checks
export const verifyPlayStoreInstallation = async (): Promise<boolean> => {
  try {
    // 1. Check Digital Asset Links
    const hasValidAssetLinks = await hasValidDigitalAssetLinks();
    
    // 2. Check TWA context
    const isTWA = isTrustedWebActivity();
    
    // 3. Check Play Store installation pattern
    const isPlayStore = isPlayStoreInstallation();
    
    // 4. Verify Android WebView context (specific to TWA)
    const isProperWebView = navigator.userAgent.includes('Android') &&
                           navigator.userAgent.includes('wv') &&
                           !navigator.userAgent.includes('Chrome/');
    
    return (hasValidAssetLinks && isTWA) || 
           (isPlayStore && isProperWebView) ||
           isTWA;
  } catch {
    return false;
  }
};

export const shouldShowMobileLanding = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Show mobile landing if:
  // 1. It's a mobile browser AND
  // 2. NOT running as installed Android app (TWA/Play Store)
  return isMobileBrowser() && !isInstalledAndroidApp();
};

// Utility to get app context for debugging
export const getAppContext = (): string => {
  if (typeof window === 'undefined') return 'server';
  
  if (isTrustedWebActivity()) return 'twa';
  if (isInstalledAndroidApp()) return 'installed-android';
  if (isStandalonePWA()) return 'pwa';
  if (isAndroidMobileBrowser()) return 'android-browser';
  if (isMobileBrowser()) return 'mobile-browser';
  
  return 'desktop-browser';
};

// Enhanced logging for debugging
export const logAppContext = (): void => {
  if (typeof window === 'undefined') return;
  
  const context = {
    appContext: getAppContext(),
    isTWA: isTrustedWebActivity(),
    isInstalledAndroid: isInstalledAndroidApp(),
    isStandalonePWA: isStandalonePWA(),
    isAndroidMobile: isAndroidMobileBrowser(),
    shouldShowMobile: shouldShowMobileLanding(),
    userAgent: navigator.userAgent,
    referrer: document.referrer,
    location: {
      protocol: window.location.protocol,
      host: window.location.host,
      pathname: window.location.pathname,
      search: window.location.search
    },
    viewport: {
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      outerWidth: window.outerWidth,
      outerHeight: window.outerHeight
    }
  };
  
  console.log('LocalYodis App Context:', context);
};


