import { ArrowLeft, Bookmark, Home, ListFilter, Settings } from "lucide-react";

import { Link } from "react-router";
import { NavigationItem } from "./NavigationItem";
import { Navigations } from "../../types/navigation";
import { useNavigate } from "react-router";
import { useNavigation } from "../../context/hooks";

export const DefaultNavigationItems = () => {
  const { navigation, setNavigation, isDesktop, activeSources, allSources } = useNavigation();

  // Determine if filters are active (i.e., not all sources are selected)
  // Ensure allSources has loaded before calculating
  const totalSources = allSources.length;
  const activeCount = activeSources.length;
  const areFiltersActive = totalSources > 0 && activeCount < totalSources;

  // Define tooltip message based on filter status
  let filterTooltip = "Filter sources";
  if (areFiltersActive) {
    filterTooltip = `Showing ${activeCount} of ${totalSources} sources`;
  } else if (totalSources > 0) {
    filterTooltip = `Showing all ${totalSources} sources`;
  }

  return (
    <>
      {/* ... Home Item ... */}
      <NavigationItem
        icon={<Home className="w-4.5" />}
        label="Home"
        onClick={() => {
          window.scrollTo(0, 0);
          setNavigation(Navigations.HOME);
        }}
        showLabel={isDesktop}
        isActive={navigation === Navigations.HOME}
      />
      {/* ... Bookmarks Item ... */}
      <NavigationItem
        icon={<Bookmark className="w-5" />}
        label="Bookmarks"
        onClick={() => {
          setNavigation(Navigations.BOOKMARKEDS);
        }}
        showLabel={isDesktop}
        isActive={navigation === Navigations.BOOKMARKEDS}
      />
      {/* Filter Item with Tooltip and Badge */}
      <div className="relative" title={filterTooltip}>
        <NavigationItem
          icon={<ListFilter className="w-5" />}
          label="Filters"
          onClick={() => {
            setNavigation(Navigations.FILTER_SOURCES);
          }}
          showLabel={isDesktop}
          isActive={navigation === Navigations.FILTER_SOURCES}
        />
        {/* Badge indicating active filters (only if not all sources are active) */}
        {areFiltersActive && (
          <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white pointer-events-none"> {/* Added pointer-events-none */}
            {activeCount} {/* Display the count of active sources */}
          </span>
        )}
      </div>
      {/* ... Settings Item ... */}
      <Link to={"/menu"}>
        <NavigationItem
          icon={<Settings className="w-5" />}
          label="Settings"
          onClick={() => {
            setNavigation(Navigations.SETTINGS);
          }}
          showLabel={isDesktop}
          isActive={navigation === Navigations.SETTINGS}
        />
      </Link>
    </>
  );
};

export const NavigationWithBack = () => {
  const { navigation, setNavigation, isDesktop } = useNavigation();
  const navigate = useNavigate();

  return (
    <>
      <NavigationItem
        icon={<ArrowLeft className="w-5" />}
        label="Back"
        onClick={() => {
          navigate(-1);
        }}
        showLabel={isDesktop}
        isActive={navigation === Navigations.SETTINGS}
      />
      <Link to={"/"}>
        <NavigationItem
          icon={<Home className="w-4.5" />}
          label="Home"
          onClick={() => {
            window.scrollTo(0, 0);
            setNavigation(Navigations.HOME);
          }}
          showLabel={isDesktop}
          isActive={navigation === Navigations.HOME}
        />
      </Link>
    </>
  );
};
