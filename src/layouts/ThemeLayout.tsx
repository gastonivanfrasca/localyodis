import { Outlet, useLocation } from "react-router";
import { getLocallyStoredData } from "../utils/storage";
import { useEffect, useLayoutEffect } from "react";
import { getViewNameFromPath } from "../utils/analytics";
import { kromemo } from "kromemo";

export const ThemeLayout = () => {
  const location = useLocation();
  useLayoutEffect(() => {
    const localData = getLocallyStoredData();
    const localTheme = localData.theme;
    document.body.classList.add(localTheme);
  }, []);

  // Track named page views on route changes
  useEffect(() => {
    const info = getViewNameFromPath(location.pathname);
    if (info) {
      kromemo.trackView({ name: info.name, payload: info.payload });
    }
  }, [location.pathname]);
  return (
    <div className="theme-layout">
      <Outlet />
    </div>
  );
};
