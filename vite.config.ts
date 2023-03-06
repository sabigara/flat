import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";
import { VitePWA } from "vite-plugin-pwa";

import { generateScopedName, hash } from "@camome/utils";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tsconfigPaths(),
    react(),
    svgr({ exportAsDefault: true }),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png"],
      manifest: {
        name: "Flat",
        short_name: "Flat",
        description: "A Bluesky client",
        theme_color: "#2563eb",
        icons: [
          {
            src: "icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  css: {
    modules: {
      generateScopedName(name, filename) {
        // @camome/core depends on static class names
        // but your own module classes won't.
        if (!filename.match(/@camome\/core/)) {
          // Whatever.
          return name + "-" + hash(filename);
        }
        return generateScopedName(name, filename);
      },
    },
  },
});
