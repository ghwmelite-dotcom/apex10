import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    cloudflare(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "icons/*.png", "apple-splash/*.png"],
      manifest: false, // Use external manifest.json
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        navigateFallback: null,
        runtimeCaching: [
          {
            // Cache API responses with stale-while-revalidate
            urlPattern: /\/api\/assets/,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "api-assets-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 5, // 5 minutes
              },
            },
          },
          {
            // Cache security content longer
            urlPattern: /\/api\/security/,
            handler: "CacheFirst",
            options: {
              cacheName: "api-security-cache",
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60, // 1 hour
              },
            },
          },
          {
            // Cache price data with network-first
            urlPattern: /\/api\/prices/,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-prices-cache",
              networkTimeoutSeconds: 3,
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60, // 1 minute
              },
            },
          },
          {
            // Cache Google Fonts stylesheets
            urlPattern: /^https:\/\/fonts\.googleapis\.com/,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "google-fonts-stylesheets",
            },
          },
          {
            // Cache Google Fonts webfonts
            urlPattern: /^https:\/\/fonts\.gstatic\.com/,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-webfonts",
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
          {
            // Cache images
            urlPattern: /\.(?:png|gif|jpg|jpeg|svg|webp)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "images-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    minify: "esbuild",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // React core
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          // Animation libraries
          "vendor-animation": ["framer-motion"],
          // Three.js (heavy, lazy loaded)
          "vendor-three": ["three", "@react-three/fiber", "@react-three/drei"],
          // TanStack Query
          "vendor-query": ["@tanstack/react-query"],
          // Utilities
          "vendor-utils": ["clsx", "tailwind-merge", "lucide-react"],
        },
      },
    },
  },
  server: {
    port: 5173,
    strictPort: true,
  },
});
