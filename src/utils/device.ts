export const isAndroidMobileBrowser = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  const userAgent = navigator.userAgent || (navigator as any).vendor || (window as any).opera || '';
  const isAndroid = /Android/i.test(userAgent);
  const isMobile = /Mobile/i.test(userAgent);
  return isAndroid && isMobile;
};

export const isStandalonePWA = (): boolean => {
  if (typeof window === 'undefined') return false;
  const matchMediaStandalone = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
  const navigatorStandalone = (navigator as any).standalone === true; // iOS
  return Boolean(matchMediaStandalone || navigatorStandalone);
};

export const shouldShowMobileLanding = (): boolean => {
  if (typeof window === 'undefined') return false;
  return isAndroidMobileBrowser() && !isStandalonePWA();
};


