import "./App.css";

import { getLocallyStoredData, storeDataLocally } from "./utils/storage";

import { BottomNavBar } from "./components/BottomNavBar";
import { HomeButtons } from "./components/v2/HomeButtons";
import { PubsList } from "./components/PubList";
import { useEffect } from "react";
import { useNavigation } from "./hooks/navigation";

function App() {
  const localData = getLocallyStoredData();
  const { navigation } = useNavigation();

  useEffect(() => {
    storeDataLocally({
      ...localData,
      navigation,
    });
  }, [navigation, localData]);

  return (
    <div className="w-full h-screen dark:bg-slate-950 max-h-screen">
      <div className="p-8 pb-24 flex flex-col gap-8 max-h-full overflow-scroll items-center">
        <PubsList />
      </div>
      <BottomNavBar customButtons={<HomeButtons />} />
    </div>
  );
}

export default App;
