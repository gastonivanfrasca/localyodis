import "./App.css";

import { HomeButtonModes, Navigations } from "./types/navigation";

import { BookmarkedsButton } from "./components/BookmarkedsButton";
import { BottomNavBar } from "./components/BottomNavBar";
import { FilterSourcesButton } from "./components/FilterSourcesButton";
import { HomeButton } from "./components/HomeButton";
import { PubsList } from "./components/PubList";
import { SettingsButton } from "./components/SettingsButton";
import { getLocallyStoredData } from "./utils/storage";
import { useState } from "react";

function App() {
  const localData = getLocallyStoredData();
  const [navigation, setNavigation] = useState<Navigations>(
    localData.navigation
  );

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
    <div className="w-full h-screen dark:bg-neutral-800 max-h-screen">
      <div className="p-8 pb-24 flex flex-col gap-8 max-h-full overflow-scroll items-center">
        <PubsList navigation={navigation} setNavigation={setNavigation} />
      </div>
      <BottomNavBar customButtons={<HomeButtons />} />
    </div>
  );
}

export default App;
