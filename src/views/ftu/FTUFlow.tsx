import { hasSeenWelcome, markWelcomeAsSeen } from "../../utils/storage";
import { useEffect, useState } from "react";

import { FirstTimeUser } from "./FirstTimeUser";
import { Welcome } from "./Welcome";

export const FTUFlow = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user has already seen the welcome screen
    const hasSeenWelcomeScreen = hasSeenWelcome();
    setShowWelcome(!hasSeenWelcomeScreen);
    setIsLoading(false);
  }, []);

  const handleWelcomeContinue = () => {
    // Mark welcome as seen and proceed to source setup
    markWelcomeAsSeen();
    setShowWelcome(false);
  };

  // Show loading while checking localStorage
  if (isLoading) {
    return (
      <div className="w-full h-dvh dark:bg-slate-950 bg-white flex items-center justify-center">
        <div className="text-zinc-600 dark:text-zinc-400">
          Cargando...
        </div>
      </div>
    );
  }

  // Show welcome screen for first-time users
  if (showWelcome) {
    return <Welcome onContinue={handleWelcomeContinue} />;
  }

  // Show source setup (existing FirstTimeUser component)
  return <FirstTimeUser />;
};
