import { BackArrowButton } from "./BackArrowButton";
import { BookmarkedsButton } from "../BookmarkedsButton";
import { DiscoverButton } from "../DiscoverButton";
import { HomeButton } from "../HomeButton";
import { HomeButtonModes } from "../../types/navigation";
import { SearchButton } from "../SearchButton";
import { SettingsButton } from "../SettingsButton";

type ButtonsProps = {
  orientation?: 'horizontal' | 'vertical';
};

export const HomeButtons = ({ orientation = 'horizontal' }: ButtonsProps = {}) => {
  const containerClasses = orientation === 'vertical' 
    ? "flex flex-col gap-4 w-full" 
    : "w-full p-8 flex justify-between items-center";

  const buttonClasses = orientation === 'vertical' 
    ? "flex items-center justify-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800/50 transition-colors duration-200" 
    : "";

  return (
    <div className={containerClasses}>
      <div className={buttonClasses}>
        <HomeButton mode={HomeButtonModes.ACTION} />
      </div>
      <div className={buttonClasses}>
        <BookmarkedsButton />
      </div>
      <div className={buttonClasses}>
        <SearchButton />
      </div>
      <div className={buttonClasses}>
        <DiscoverButton />
      </div>
      <div className={buttonClasses}>
        <SettingsButton />
      </div>
    </div>
  );
};

export const SettingsButtons = ({ orientation = 'horizontal' }: ButtonsProps = {}) => {
  const containerClasses = orientation === 'vertical' 
    ? "flex flex-col gap-4 w-full" 
    : "w-full p-8 flex justify-between items-center";

  const buttonClasses = orientation === 'vertical' 
    ? "flex items-center justify-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800/50 transition-colors duration-200" 
    : "";

  return (
    <div className={containerClasses}>
      <div className={buttonClasses}>
        <BackArrowButton />
      </div>
      <div className={buttonClasses}>
        <HomeButton mode={HomeButtonModes.LINK} />
      </div>
    </div>
  );
};
