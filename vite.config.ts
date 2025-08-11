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
          name: 'LocalYodis - RSS Reader',
          short_name: 'LocalYodis',
          background_color: '#020618',
          categories: ["rss", "reader", "news"],
          display: 'standalone',
          start_url: '/',
          scope: '/',
          orientation: 'portrait',
          lang: 'en',
          prefer_related_applications: false,
          description: 'A privacy-focused local RSS reader that aggregates news and content from your favorite websites. All data stored locally on your device for maximum privacy.',
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
              },
              {
                src: 'maskable-icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any maskable'
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
  };
});
