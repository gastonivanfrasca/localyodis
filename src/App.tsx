import "./App.css";

import { BottomNavBar } from "./components/BottomNavBar";
import { HomeButtons } from "./components/v2/HomeButtons";
import { PubsList } from "./components/PubList";

function App() {
  return (
    <div className="w-full h-screen dark:bg-slate-950 max-h-screen">
      <div className="px-0 pb-24 pt-2 flex flex-col gap-8 max-h-full overflow-scroll items-center">
        <PubsList />
      </div>
      <BottomNavBar customButtons={<HomeButtons />} />
    </div>
  );
}

export default App;
