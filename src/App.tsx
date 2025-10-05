import "./App.css";

import { AdaptiveNavigation } from "./components/AdaptiveNavigation";
import { Navigations } from "./types/navigation";
import { PubsList } from "./components/PubList";
import { SearchInput } from "./components/v2/SearchInput";
import { SectionIndicator } from "./components/v2/SectionIndicator";
import { NewItemsPill } from "./components/v2/NewItemsPill";
import Snackbar from "./components/Snackbar";
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
        <NewItemsPill />
        <div className="px-8 md:px-6 pt-2 flex flex-col gap-8 max-h-full overflow-scroll items-center bg-white dark:bg-slate-950 hide-scrollbar">
          <PubsList />
        </div>
      </AdaptiveNavigation>
      <Snackbar />
    </div>
  );
}

export default App;
