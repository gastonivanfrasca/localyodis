export const isAndroidMobileBrowser = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  const userAgent = navigator.userAgent || (navigator as any).vendor || (window as any).opera || '';
  const isAndroid = /Android/i.test(userAgent);
  const isMobile = /Mobile/i.test(userAgent);
  return isAndroid && isMobile;
};

export const isMobileBrowser = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  const userAgent = navigator.userAgent || (navigator as any).vendor || (window as any).opera || '';
  return /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
};

export const isStandalonePWA = (): boolean => {
  if (typeof window === 'undefined') return false;
  const matchMediaStandalone = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
  const navigatorStandalone = (navigator as any).standalone === true; // iOS
  return Boolean(matchMediaStandalone || navigatorStandalone);
};

// Enhanced TWA detection - checks if running from installed Android app (AAB/APK)
export const isTrustedWebActivity = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Check for TWA-specific indicators
  const indicators = [
    // TWA referrer patterns
    document.referrer.includes('android-app://'),
    
    // TWA user agent patterns
    /wv\)/i.test(navigator.userAgent) && /Version\/[\d.]+/i.test(navigator.userAgent),
    
    // Android WebView with Chrome
    navigator.userAgent.includes('Android') && 
    navigator.userAgent.includes('Chrome') && 
    navigator.userAgent.includes('wv'),
    
    // Check for TWA-specific navigation timing
    window.performance && 
    window.performance.navigation && 
    window.performance.navigation.type === 0 &&
    !document.referrer.includes('http'),
    
    // TWA typically runs in fullscreen without browser chrome
    window.outerHeight === window.innerHeight && 
    window.outerWidth === window.innerWidth &&
    navigator.userAgent.includes('Android'),
    
    // Check for Android app context
    window.location.protocol === 'https:' &&
    !window.location.search.includes('utm_source') &&
    navigator.userAgent.includes('Mobile') &&
    navigator.userAgent.includes('Android') &&
    !navigator.userAgent.includes('Chrome/') // Excludes regular Chrome browser
  ];
  
  // Additional check for package name in user agent (some TWAs include this)
  const hasPackageIndicator = /app\.vercel\.localyodis/i.test(navigator.userAgent) ||
                              /localyodis/i.test(navigator.userAgent);
  
  // Consider it TWA if multiple indicators are present or package indicator exists
  const indicatorCount = indicators.filter(Boolean).length;
  return hasPackageIndicator || indicatorCount >= 2;
};

// Enhanced detection for installed Android app (TWA from Play Store)
export const isInstalledAndroidApp = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Primary checks for TWA
  if (isTrustedWebActivity()) {
    return true;
  }
  
  // Secondary check: Android PWA installed through Play Store
  if (isStandalonePWA() && navigator.userAgent.includes('Android')) {
    // Check if it's likely from Play Store (not browser install)
    const hasPlayStoreIndicators = [
      !window.location.search.includes('utm_source=pwa'),
      window.location.pathname === '/' || window.location.pathname === '',
      !sessionStorage.getItem('pwa_install_prompt_shown')
    ].every(Boolean);
    
    return hasPlayStoreIndicators;
  }
  
  return false;
};

export const shouldShowMobileLanding = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Show mobile landing if:
  // 1. It's Android mobile browser AND
  // 2. NOT running as installed Android app (TWA/Play Store)
  return isAndroidMobileBrowser() && !isInstalledAndroidApp();
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


