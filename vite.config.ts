import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(() => {

  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: "autoUpdate",
        devOptions: {
          enabled: true,
        },
        includeAssets: ["logo.png", "maskable-icon-512x512.png", "apple-touch-icon-180x180.png"],
        manifest: {
          name: 'Localyodis',
          short_name: 'Localyodis',
          background_color: '#020618',
          categories: ["rss", "reader", "news"],
          display: 'standalone',
          description: 'A local RSS reader',
          theme_color: '#020618',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        }
      }),
    ],
    server: {
      proxy: {
        "/api": {
          changeOrigin: true,
          secure: false,
        },
      },
    },
    test: {
      environment: "jsdom",
      setupFiles: "./vitest.setup.ts",
      globals: true,
    },
  };
});
