import { BackArrowButton } from "./BackArrowButton";
import React from "react";

interface NavigationTitleWithBackProps {
  label: string;
}

export const NavigationTitleWithBack: React.FC<
  NavigationTitleWithBackProps
> = ({ label }) => (
  <div className="flex items-center gap-4 absolute top-5 left-5">
    <BackArrowButton />
    <div className="text-2xl font-bold tracking-tight dark:text-white">{label}</div>
  </div>
);
