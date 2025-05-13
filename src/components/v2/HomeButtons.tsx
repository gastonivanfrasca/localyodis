import { BookmarkedsButton } from "../BookmarkedsButton";
import { FilterSourcesButton } from "../FilterSourcesButton";
import { HomeButton } from "../HomeButton";
import { HomeButtonModes } from "../../types/navigation";
import { SettingsButton } from "../SettingsButton";

export const HomeButtons = () => {
  return (
    <div className="w-full p-8 flex justify-between items-center">
      <HomeButton mode={HomeButtonModes.ACTION} />
      <BookmarkedsButton />
      <FilterSourcesButton />
      <SettingsButton />
    </div>
  );
};
