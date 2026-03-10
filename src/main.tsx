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

const KROMEMO_ERROR_LIMIT = 10;
const KROMEMO_ERROR_WINDOW_MS = 60_000;

let trackedErrorCount = 0;
let trackedErrorWindowStart = Date.now();

const canTrackRuntimeError = () => {
  const now = Date.now();

  if (now - trackedErrorWindowStart > KROMEMO_ERROR_WINDOW_MS) {
    trackedErrorWindowStart = now;
    trackedErrorCount = 0;
  }

  if (trackedErrorCount >= KROMEMO_ERROR_LIMIT) {
    return false;
  }

  trackedErrorCount += 1;
  return true;
};

const trackRuntimeError = (
  error: Error | string,
  payload?: Record<string, unknown>,
) => {
  if (!canTrackRuntimeError()) {
    return;
  }

  kromemo.trackError({ error, payload });
};

kromemo.init({
  projectId: import.meta.env.VITE_KROMEMO_PROJECT_ID,
  apiKey: import.meta.env.VITE_KROMEMO_API_KEY,
  endpointBase: import.meta.env.VITE_KROMEMO_ENDPOINT,
  autoPageViews: false, // we'll track named views manually
  dedupeWindowMs: import.meta.env.VITE_KROMEMO_DEDUPE_MS ? Number(import.meta.env.VITE_KROMEMO_DEDUPE_MS) : 800,
});

window.addEventListener("error", (event) => {
  const error = event.error instanceof Error
    ? event.error
    : event.message || "Unknown error";

  trackRuntimeError(error, {
    source: "window.error",
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
  });
});

window.addEventListener("unhandledrejection", (event) => {
  const error = event.reason instanceof Error || typeof event.reason === "string"
    ? event.reason
    : "Unhandled promise rejection";

  trackRuntimeError(error, {
    source: "window.unhandledrejection",
  });
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
