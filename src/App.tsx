import "./App.css";

import { AdaptiveNavigation } from "./components/AdaptiveNavigation";
import { FirstTimeUser } from "./views/ftu/FirstTimeUser";
import { Navigations } from "./types/navigation";
import { PubsList } from "./components/PubList";
import { SearchInput } from "./components/v2/SearchInput";
import { SectionIndicator } from "./components/v2/SectionIndicator";
import Snackbar from "./components/Snackbar";
import { useMainContext } from "./context/main";

function App() {
  const { state } = useMainContext();

  // Show FTU if no sources are configured (simple, clean logic)
  if (state.sources.length === 0) {
    return (
      <div className="w-full h-screen">
        <FirstTimeUser />
        <Snackbar />
      </div>
    );
  }

  // Show normal app if sources exist
  return (
    <div className="w-full h-screen dark:bg-slate-950 bg-white max-h-screen">
      <AdaptiveNavigation>
        {state.navigation === Navigations.SEARCH && <SearchInput />}
        <SectionIndicator />
        <div className="px-8 md:px-6 pt-2 flex flex-col gap-8 max-h-full overflow-scroll items-center bg-white dark:bg-slate-950 hide-scrollbar">
          <PubsList />
        </div>
      </AdaptiveNavigation>
      <Snackbar />
    </div>
  );
}

export default App;
