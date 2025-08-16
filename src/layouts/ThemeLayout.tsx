import { Outlet, useLocation, useNavigate } from "react-router";
import { isInstalledAndroidApp, logAppContext, shouldShowMobileLanding } from "../utils/device";
import { useEffect, useLayoutEffect } from "react";

import Snackbar from "../components/Snackbar";
import { getLocallyStoredData } from "../utils/storage";

export const ThemeLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useLayoutEffect(() => {
    const localData = getLocallyStoredData();
    const localTheme = localData.theme;
    document.body.classList.add(localTheme);
  }, []);

  useEffect(() => {
    // Enhanced app access control
    const isAndroidApp = isInstalledAndroidApp();
    const shouldRedirectToMobile = shouldShowMobileLanding();
    
    // Log context for debugging
    console.log('ThemeLayout access check:', {
      pathname: location.pathname,
      isAndroidApp,
      shouldRedirectToMobile
    });
    
    // Redirect to mobile landing if not running as installed Android app
    if (location.pathname !== '/mobile' && !isAndroidApp) {
      console.log('Redirecting to /mobile - app not running as installed Android app');
      logAppContext(); // Log detailed context for debugging
      navigate('/mobile', { replace: true });
    }
    
    // Also handle legacy mobile detection
    if (location.pathname !== '/mobile' && shouldRedirectToMobile) {
      navigate('/mobile', { replace: true });
    }
  }, [location.pathname, navigate]);
  return (
    <div className="theme-layout">
      <Outlet />
      <Snackbar />
    </div>
  );
};
