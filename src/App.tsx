import "./App.css";

import { BottomNavBar } from "./components/BottomNavBar";
import { HomeButtons } from "./components/v2/ViewButtons";
import { Navigations } from "./types/navigation";
import { PubsList } from "./components/PubList";
import { SearchInput } from "./components/v2/SearchInput";
import { useMainContext } from "./context/main";

function App() {
  const { state } = useMainContext();

  return (
    <div className="w-full h-screen dark:bg-slate-950 max-h-screen">
      <div className="px-0 pb-24 pt-2 flex flex-col gap-8 max-h-full overflow-scroll items-center">
        <PubsList />
      </div>
      {state.navigation === Navigations.SEARCH && <SearchInput />}
      <BottomNavBar customButtons={<HomeButtons />} />
    </div>
  );
}

export default App;
