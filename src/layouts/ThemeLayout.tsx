import { Outlet } from "react-router";
import { getLocallyStoredData } from "../utils/storage";
import { useLayoutEffect } from "react";

export const ThemeLayout = () => {
  useLayoutEffect(() => {
    const localData = getLocallyStoredData();
    const localTheme = localData.theme;
    document.body.classList.add(localTheme);
  }, []);
  return (
    <div className="theme-layout">
      <Outlet />
    </div>
  );
};
