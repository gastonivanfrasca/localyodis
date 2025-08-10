import { Outlet, useLocation, useNavigate } from "react-router";
import Snackbar from "../components/Snackbar";
import { getLocallyStoredData } from "../utils/storage";
import { useEffect, useLayoutEffect } from "react";
import { shouldShowMobileLanding } from "../utils/device";

export const ThemeLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useLayoutEffect(() => {
    const localData = getLocallyStoredData();
    const localTheme = localData.theme;
    document.body.classList.add(localTheme);
  }, []);

  useEffect(() => {
    if (location.pathname !== '/mobile' && shouldShowMobileLanding()) {
      navigate('/mobile', { replace: true });
    }
  }, [location.pathname, navigate]);
  return (
    <div className="theme-layout">
      <Outlet />
      <Snackbar />
    </div>
  );
};
