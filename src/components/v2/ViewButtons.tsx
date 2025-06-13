import { BackArrowButton } from "./BackArrowButton";
import { BookmarkedsButton } from "../BookmarkedsButton";
import { FilterSourcesButton } from "../FilterSourcesButton";
import { HomeButton } from "../HomeButton";
import { HomeButtonModes } from "../../types/navigation";
import { SearchButton } from "../SearchButton";
import { SettingsButton } from "../SettingsButton";

export const HomeButtons = () => {
  return (
    <div className="w-full p-8 flex justify-between items-center">
      <HomeButton mode={HomeButtonModes.ACTION} />
      <BookmarkedsButton />
      <SearchButton />
      <FilterSourcesButton />
      <SettingsButton />
    </div>
  );
};

export const SettingsButtons = () => {
  return (
    <div className="w-full p-8 flex justify-between items-center">
      <BackArrowButton />
      <HomeButton mode={HomeButtonModes.LINK} />
    </div>
  );
};
