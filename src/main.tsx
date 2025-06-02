import { BrowserRouter, Route, Routes } from "react-router";

import App from "./App.tsx";
import { MainProvider } from "./context/main/provider.tsx";
import { Menu } from "./views/menu/Menu.tsx";
import { Sources } from "./views/sources/Sources.tsx";
import { StrictMode } from "react";
import { ThemeLayout } from "./layouts/ThemeLayout.tsx";
import { createRoot } from "react-dom/client";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MainProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<ThemeLayout />}>
            <Route path="/" element={<App />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/sources" element={<Sources />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </MainProvider>
  </StrictMode>
);
