import { NavigationTitleWithBack } from "../../components/v2/NavigationTitleWithBack";

export const Settings = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-black dark:text-white font-sans flex flex-col">
      <NavigationTitleWithBack label="Settings" />
      
      {/* Main Content Container - Centered on Desktop */}
      <div className="flex-1 flex justify-center">
        <div className="w-full max-w-2xl px-6 mt-16 flex flex-col gap-5 py-6">
          {/* Settings content will go here */}
        </div>
      </div>
    </div>
  );
}; 