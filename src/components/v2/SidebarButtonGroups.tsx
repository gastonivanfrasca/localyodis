import {
  SidebarBookmarksButton,
  SidebarDiscoverButton,
  SidebarHomeButton,
  SidebarSearchButton,
  SidebarSettingsButton
} from './SidebarButtons';

import { HomeButtonModes } from '../../types/navigation';

export const SidebarHomeButtons = () => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <SidebarHomeButton mode={HomeButtonModes.ACTION} />
      <SidebarBookmarksButton />
      <SidebarSearchButton />
      <SidebarDiscoverButton />
      <SidebarSettingsButton />
    </div>
  );
};