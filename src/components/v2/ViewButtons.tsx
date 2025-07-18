import { BackArrowButton } from "./BackArrowButton";
import { BookmarkedsButton } from "../BookmarkedsButton";
import { DiscoverButton } from "../DiscoverButton";
import { HistoryButton } from "../HistoryButton";
import { HomeButton } from "../HomeButton";
import { HomeButtonModes } from "../../types/navigation";
import { MenuButton } from "../MenuButton";
import { SearchButton } from "../SearchButton";

type ButtonsProps = {
  orientation?: 'horizontal' | 'vertical';
};

export const HomeButtons = ({ orientation = 'horizontal' }: ButtonsProps = {}) => {
  const containerClasses = orientation === 'vertical' 
    ? "flex flex-col gap-4 w-full" 
    : "w-full px-4 py-2 flex justify-evenly items-center";

  const buttonClasses = orientation === 'vertical' 
    ? "flex items-center justify-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800/50 transition-colors duration-200" 
    : "flex items-center justify-center min-w-[48px]";

  return (
    <div className={containerClasses}>
      <div className={buttonClasses}>
        <HomeButton mode={HomeButtonModes.ACTION} />
      </div>
      <div className={buttonClasses}>
        <BookmarkedsButton />
      </div>
      <div className={buttonClasses}>
        <HistoryButton />
      </div>
      <div className={buttonClasses}>
        <SearchButton />
      </div>
      <div className={buttonClasses}>
        <DiscoverButton />
      </div>
      <div className={buttonClasses}>
        <MenuButton />
      </div>
    </div>
  );
};

export const SettingsButtons = ({ orientation = 'horizontal' }: ButtonsProps = {}) => {
  const containerClasses = orientation === 'vertical' 
    ? "flex flex-col gap-4 w-full" 
    : "w-full px-4 py-2 flex justify-evenly items-center";

  const buttonClasses = orientation === 'vertical' 
    ? "flex items-center justify-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800/50 transition-colors duration-200" 
    : "flex items-center justify-center min-w-[48px]";

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
