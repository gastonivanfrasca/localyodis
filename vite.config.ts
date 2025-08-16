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
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
          cleanupOutdatedCaches: true,
          skipWaiting: true,
          clientsClaim: true,
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
                }
              }
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
                }
              }
            },
            {
              urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'images-cache',
                expiration: {
                  maxEntries: 60,
                  maxAgeSeconds: 60 * 60 * 24 * 30 // <== 30 days
                }
              }
            },
            {
              urlPattern: ({ request }) => request.destination === 'document',
              handler: 'NetworkFirst',
              options: {
                cacheName: 'pages-cache',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24 * 7 // <== 7 days
                }
              }
            },
            {
              urlPattern: /\/api\/.*$/,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'api-cache',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24 // <== 1 day
                },
                networkTimeoutSeconds: 10,
                backgroundSync: {
                  name: 'api-queue',
                  options: {
                    maxRetentionTime: 24 * 60 // 24 hours
                  }
                }
              }
            }
          ]
        },
        includeAssets: ["logo.png", "maskable-icon-512x512.png", "apple-touch-icon-180x180.png"],
        manifest: {
          id: '/localyodis/',
          name: 'LocalYodis - RSS Reader',
          short_name: 'LocalYodis',
          background_color: '#020618',
          categories: ["rss", "reader", "news"],
          display: 'standalone',
          display_override: ['window-controls-overlay'],
          start_url: '/',
          scope: '/',
          orientation: 'portrait',
          lang: 'en',
          dir: 'ltr',
          iarc_rating_id: 'e58c174a-81d2-5c3c-32cc-34b8de4a52e8',
          prefer_related_applications: true,
          related_applications: [
            {
              platform: 'play',
              url: 'https://play.google.com/store/apps/details?id=app.vercel.localyodis.twa',
              id: 'app.vercel.localyodis.twa'
            }
          ],
          description: 'A privacy-focused local RSS reader that aggregates news and content from your favorite websites. All data stored locally on your device for maximum privacy.',
          theme_color: '#020618',
          launch_handler: {
            client_mode: 'navigate-existing'
          },
          screenshots: [
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              form_factor: 'wide',
              label: 'LocalYodis RSS Reader - Wide view'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              form_factor: 'narrow',
              label: 'LocalYodis RSS Reader - Mobile view'
            }
          ],
          icons: [
            // Standard icons (purpose: 'any')
            {
              src: 'pwa-64x64.png',
              sizes: '64x64',
              type: 'image/png',
              purpose: 'any'
            },
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any'
            },
            // Maskable icons (purpose: 'maskable')
            {
              src: 'maskable-icon-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable'
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
