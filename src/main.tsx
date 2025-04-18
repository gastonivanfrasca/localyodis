import { BrowserRouter, Route, Routes } from "react-router";

import App from "./App.tsx";
import { Menu } from "./views/menu/Menu.tsx";
import { NavigationProvider } from "./context/NavigationContext";
import { Sources } from "./views/sources/Sources.tsx";
import { StrictMode } from "react";
import { ThemeLayout } from "./layouts/ThemeLayout.tsx";
import { createRoot } from "react-dom/client";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <NavigationProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<ThemeLayout />}>
            <Route path="/" element={<App />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/sources" element={<Sources />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </NavigationProvider>
  </StrictMode>
);
