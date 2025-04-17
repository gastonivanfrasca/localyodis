import "./App.css";

import { DefaultNavigationItems } from "./components/v2/NavigationItems";
import { NavBar } from "./components/BottomNavBar";
import { PubsList } from "./components/PubList";
import { useNavigation } from "./context/hooks";

function App() {
  const { navigation, setNavigation, isDesktop } = useNavigation();

  return (
    <div className="w-full h-screen dark:bg-slate-900 max-h-screen md:flex md:flex-row md:gap-0 gap-8">
      <NavBar items={<DefaultNavigationItems />} desktop={isDesktop} />
      <div className="p-8 pb-24 flex flex-col gap-8 h-full overflow-scroll items-center">
        <PubsList navigation={navigation} setNavigation={setNavigation} />
      </div>
    </div>
  );
}

export default App;
