import {
  SidebarBookmarksButton,
  SidebarDiscoverButton,
  SidebarHomeButton,
  SidebarMenuButton,
  SidebarSearchButton
} from './SidebarButtons';

import { HomeButtonModes } from '../../types/navigation';

export const SidebarHomeButtons = () => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <SidebarHomeButton mode={HomeButtonModes.ACTION} />
      <SidebarBookmarksButton />
      <SidebarSearchButton />
      <SidebarDiscoverButton />
      <SidebarMenuButton />
    </div>
  );
};