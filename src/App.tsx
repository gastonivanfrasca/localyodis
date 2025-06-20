import "./App.css";

import { AdaptiveNavigation } from "./components/AdaptiveNavigation";
import { Navigations } from "./types/navigation";
import { PubsList } from "./components/PubList";
import { SearchInput } from "./components/v2/SearchInput";
import { useMainContext } from "./context/main";

function App() {
  const { state } = useMainContext();

  return (
    <div className="w-full h-screen dark:bg-slate-950 max-h-screen">
      <AdaptiveNavigation>
        {state.navigation === Navigations.SEARCH && <SearchInput />}
        <div className="px-4 md:px-6 pt-2 flex flex-col gap-8 max-h-full overflow-scroll items-center">
          <PubsList />
        </div>
      </AdaptiveNavigation>
    </div>
  );
}

export default App;
