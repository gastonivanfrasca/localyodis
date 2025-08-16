import "./App.css";

import { getAppContext, isInstalledAndroidApp, logAppContext } from "./utils/device";

import { AdaptiveNavigation } from "./components/AdaptiveNavigation";
import DebugContext from "./components/DebugContext";
import { Navigations } from "./types/navigation";
import { PubsList } from "./components/PubList";
import { SearchInput } from "./components/v2/SearchInput";
import { SectionIndicator } from "./components/v2/SectionIndicator";
import { useEffect } from "react";
import { useMainContext } from "./context/main";
import { useNavigate } from "react-router";

function App() {
  const { state } = useMainContext();
  const navigate = useNavigate();

  // Redirect to FTU if no sources are configured
  useEffect(() => {
    if (state.sources.length === 0) {
      navigate("/ftu");
    }
  }, [state.sources.length, navigate]);

  // Initialize app context detection
  useEffect(() => {
    // Log detailed app context for debugging
    logAppContext();
    
    // Check if running as installed Android app
    const isAndroidApp = isInstalledAndroidApp();
    const context = getAppContext();
    
    console.log('LocalYodis App Context:', {
      context,
      isAndroidApp,
      shouldAllowApp: isAndroidApp
    });
    
    // If not running as installed Android app, user should be redirected to /mobile
    // This is handled by ThemeLayout, but we can track it here
    if (!isAndroidApp && window.location.pathname !== '/mobile') {
      console.log('Non-Android app access detected - should redirect to /mobile');
    }
  }, []);

  // Don't render anything if redirecting to FTU
  if (state.sources.length === 0) {
    return null;
  }

  // Show normal app if sources exist
  return (
    <div className="w-full h-dvh dark:bg-slate-950 bg-white max-h-screen">
      <AdaptiveNavigation>
        {state.navigation === Navigations.SEARCH && <SearchInput />}
        <SectionIndicator />
        <div className="px-8 md:px-6 pt-2 flex flex-col gap-8 max-h-full overflow-scroll items-center bg-white dark:bg-slate-950 hide-scrollbar">
          <PubsList />
        </div>
      </AdaptiveNavigation>
      
      {/* App is now restricted to installed Android apps only */}
      {/* Debug context - shows only in development or with Ctrl+Shift+D */}
      <DebugContext />
    </div>
  );
}

export default App;
