import "./App.css";

import { BottomNavBar } from "./components/BottomNavBar";

function App() {
  return (
    <div className="w-full h-screen dark:bg-neutral-800">
      <BottomNavBar menu home  />
    </div>
  );
}

export default App;
