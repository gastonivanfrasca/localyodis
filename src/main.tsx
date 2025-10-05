import { BrowserRouter, Route, Routes } from "react-router";

import App from "./App.tsx";
import { Discover } from "./views/discover/Discover.tsx";
import { FirstTimeUser } from "./views/ftu/FirstTimeUser.tsx";
import { I18nProvider } from "./context/i18n/index.tsx";
import { MainProvider } from "./context/main/provider.tsx";
import { Menu } from "./views/menu/Menu.tsx";
import { Settings } from "./views/settings/Settings.tsx";
import { SourceProfile } from "./views/sources/SourceProfile.tsx";
import { Sources } from "./views/sources/Sources.tsx";
import { Statistics } from "./views/statistics/Statistics.tsx";
import { StrictMode } from "react";
import { ThemeLayout } from "./layouts/ThemeLayout.tsx";
import { createRoot } from "react-dom/client";
import kromemo from "kromemo";


kromemo.init({
  projectId: import.meta.env.VITE_KROMEMO_PROJECT_ID,
  apiKey: import.meta.env.VITE_KROMEMO_API_KEY,
  endpointBase: import.meta.env.VITE_KROMEMO_ENDPOINT,
  autoPageViews: false, // we'll track named views manually
  autoErrors: true,
  dedupeWindowMs: import.meta.env.VITE_KROMEMO_DEDUPE_MS ? Number(import.meta.env.VITE_KROMEMO_DEDUPE_MS) : 800,
});


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <I18nProvider>
      <MainProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<ThemeLayout />}>
              <Route path="/" element={<App />} />
              <Route path="/ftu" element={<FirstTimeUser />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/sources" element={<Sources />} />
              <Route path="/sources/:id" element={<SourceProfile />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/statistics" element={<Statistics />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </MainProvider>
    </I18nProvider>
  </StrictMode>
);
