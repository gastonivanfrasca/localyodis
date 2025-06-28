import "./App.css";

import { AdaptiveNavigation } from "./components/AdaptiveNavigation";
import { FirstTimeUser } from "./views/ftu/FirstTimeUser";
import { Navigations } from "./types/navigation";
import { PubsList } from "./components/PubList";
import { SearchInput } from "./components/v2/SearchInput";
import Snackbar from "./components/Snackbar";
import { useMainContext } from "./context/main";

function App() {
  const { state } = useMainContext();

  // Show FTU view if navigation is set to FTU
  if (state.navigation === Navigations.FTU) {
    return (
      <div className="w-full h-screen">
        <FirstTimeUser />
        <Snackbar />
      </div>
    );
  }

  return (
    <div className="w-full h-screen dark:bg-slate-950 max-h-screen">
      <AdaptiveNavigation>
        {state.navigation === Navigations.SEARCH && <SearchInput />}
        <div className="px-4 md:px-6 pt-2 flex flex-col gap-8 max-h-full overflow-scroll items-center">
          <PubsList />
        </div>
      </AdaptiveNavigation>
      <Snackbar />
    </div>
  );
}

export default App;
