import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";

import { generateScopedName, hash } from "@camome/utils";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tsconfigPaths(), react(), svgr({ exportAsDefault: true })],
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
