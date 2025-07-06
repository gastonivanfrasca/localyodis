import { BottomNavBar } from "./BottomNavBar";
import { HomeButtons } from "./v2/ViewButtons";
import React from "react";
import { SidebarHomeButtons } from "./v2/SidebarButtonGroups";

type AdaptiveNavigationProps = {
  children: React.ReactNode;
};

export const AdaptiveNavigation = ({ children }: AdaptiveNavigationProps) => {
  const sidebarButtons = <SidebarHomeButtons />;
  const bottomNavButtons = <HomeButtons orientation="horizontal" />;

  return (
    <div className="flex h-screen w-full bg-white dark:bg-slate-950">
      {/* Desktop Sidebar - Optimized for space */}
      <aside className="hidden md:flex md:flex-col md:w-20 md:bg-white md:dark:bg-slate-950 md:shadow-lg md:shadow-gray-300 md:dark:shadow-white/10 md:border-r md:border-gray-200 md:dark:border-gray-700 md:sticky md:top-0 md:h-screen">
        <div className="flex-1 flex flex-col justify-center p-3">
          <nav className="flex flex-col gap-2">{sidebarButtons}</nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col md:overflow-hidden bg-white dark:bg-slate-950">
        {/* Content */}
        <div className="flex-1 pb-24 md:pb-0 md:overflow-auto bg-white dark:bg-slate-950">
          <div className="h-full w-full bg-white dark:bg-slate-950">{children}</div>
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden">
          <BottomNavBar customButtons={bottomNavButtons} />
        </div>
      </main>
    </div>
  );
};
