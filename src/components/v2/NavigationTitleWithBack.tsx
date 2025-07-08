import { BackArrowButton } from "./BackArrowButton";
import React from "react";

interface NavigationTitleWithBackProps {
  label: string;
}

export const NavigationTitleWithBack: React.FC<
  NavigationTitleWithBackProps
> = ({ label }) => (
  <div className="fixed top-0 left-0 right-0 z-10 bg-white dark:bg-slate-950 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
    <div className="flex items-center gap-4">
      <BackArrowButton />
      <div className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">{label}</div>
    </div>
  </div>
);
