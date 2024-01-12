import path from "path";

import { generateScopedName, hash } from "@camome/utils";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tsconfigPaths(),
    react(),
    svgr({
      include: ["**/*.svg"],
      svgrOptions: {
        exportType: "default",
      },
    }),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png"],
      manifest: {
        name: "Flat",
        short_name: "Flat",
        description: "A Bluesky client",
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
  resolve: {
    alias: {
      var: path.resolve("src/styles/var.scss"),
      mixins: path.resolve("src/styles/mixins.scss"),
    },
  },
});
