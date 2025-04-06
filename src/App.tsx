import "./App.css";

import { HomeButtonModes, Navigations } from "./types/navigation";
import { getLocallyStoredData, storeDataLocally } from "./utils/storage";
import { useEffect, useState } from "react";

import { BookmarkedsButton } from "./components/BookmarkedsButton";
import { BottomNavBar } from "./components/BottomNavBar";
import { FilterSourcesButton } from "./components/FilterSourcesButton";
import { HomeButton } from "./components/HomeButton";
import { PubsList } from "./components/PubList";
import { SettingsButton } from "./components/SettingsButton";

function App() {
  const localData = getLocallyStoredData();
  const [navigation, setNavigation] = useState<Navigations>(
    localData.navigation
  );

  useEffect(() => {
    storeDataLocally({
      ...localData,
      navigation,
    });
  }, [navigation, localData]);

  const HomeButtons = () => {
    return (
      <div className="w-full p-8 flex justify-between items-center">
        <HomeButton
          navigation={navigation}
          setNavigation={setNavigation}
          mode={HomeButtonModes.ACTION}
        />
        <BookmarkedsButton
          navigation={navigation}
          setNavigation={setNavigation}
        />
        <FilterSourcesButton
          navigation={navigation}
          setNavigation={setNavigation}
        />
        <SettingsButton navigation={navigation} setNavigation={setNavigation} />
      </div>
    );
  };

  return (
    <div className="w-full h-screen dark:bg-slate-950 max-h-screen">
      <div className="p-8 pb-24 flex flex-col gap-8 max-h-full overflow-scroll items-center">
        <PubsList navigation={navigation} setNavigation={setNavigation} />
      </div>
      <BottomNavBar customButtons={<HomeButtons />} />
    </div>
  );
}

export default App;
