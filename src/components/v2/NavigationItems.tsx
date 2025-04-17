import {
  ArrowLeft,
  Bookmark,
  Home,
  ListFilter,
  Settings,
} from "lucide-react";
import { getLocallyStoredData, storeDataLocally } from "../../utils/storage";

import { Link } from "react-router";
import { NavigationItem } from "./NavigationItem";
import { Navigations } from "../../types/navigation";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useNavigation } from "../../context/hooks";

export const DefaultNavigationItems = () => {
  const { navigation, setNavigation } = useNavigation();

  const isDesktop = window.innerWidth > 768;

  useEffect(() => {
    const localData = getLocallyStoredData();
    storeDataLocally({
      ...localData,
      navigation,
    });
  }, [navigation]);

  return (
    <>
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
      <NavigationItem
        icon={<Bookmark className="w-5" />}
        label="Bookmarks"
        onClick={() => {
          setNavigation(Navigations.BOOKMARKEDS);
        }}
        showLabel={isDesktop}
        isActive={navigation === Navigations.BOOKMARKEDS}
      />
      <NavigationItem
        icon={<ListFilter className="w-5" />}
        label="Filters"
        onClick={() => {
          setNavigation(Navigations.FILTER_SOURCES);
        }}
        showLabel={isDesktop}
        isActive={navigation === Navigations.FILTER_SOURCES}
      />
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
  const { navigation, setNavigation } = useNavigation();
  const navigate = useNavigate();

  const isDesktop = window.innerWidth > 768;

  useEffect(() => {
    const localData = getLocallyStoredData();
    storeDataLocally({
      ...localData,
      navigation,
    });
  }, [navigation]);

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
