import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["apple-touch-icon.png", "SpaceGrotesk.ttf", "JetBrainsMono.ttf"],
      manifest: {
        name: "Content Office",
        short_name: "Office",
        description: "Your content team: plan, write and build reels from your phone.",
        theme_color: "#0B1220",
        background_color: "#0B1220",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        icons: [
          { src: "icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: { navigateFallbackDenylist: [/^\/api\//], globPatterns: ["**/*.{js,css,html,png,ttf,svg}"] },
    }),
  ],
  server: {
    proxy: { "/api": { target: "http://127.0.0.1:8787", ws: true, changeOrigin: false } },
  },
});
