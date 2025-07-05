import {
  SidebarBookmarksButton,
  SidebarDiscoverButton,
  SidebarFilterButton,
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
      <SidebarFilterButton />
      <SidebarSettingsButton />
    </div>
  );
};