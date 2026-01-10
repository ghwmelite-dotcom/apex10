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
    target: "esnext",
    rollupOptions: {
      output: {
        manualChunks(id) {
          // React core - smallest possible
          if (id.includes("react-dom")) return "vendor-react";
          if (id.includes("react-router")) return "vendor-react";
          if (id.includes("node_modules/react/")) return "vendor-react";

          // Three.js - lazy loaded, separate chunk
          if (id.includes("three") || id.includes("@react-three")) return "vendor-three";

          // Web3 libraries - separate chunk for wallet pages
          if (id.includes("wagmi") || id.includes("viem") || id.includes("@wagmi") || id.includes("@walletconnect")) return "vendor-web3";

          // Animation - can be deferred
          if (id.includes("framer-motion")) return "vendor-animation";

          // TanStack Query
          if (id.includes("@tanstack")) return "vendor-query";

          // Icons - tree-shake but group together
          if (id.includes("lucide-react")) return "vendor-icons";
        },
      },
    },
  },
  server: {
    port: 5173,
    strictPort: true,
  },
});
