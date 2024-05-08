import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: "assets", replacement: "/src/assets" },
      { find: "pages", replacement: "/src/pages" },
      { find: "components", replacement: "/src/components" },
      { find: "api", replacement: "/src/api" },
      { find: "utils", replacement: "/src/utils" },
    ],
  },
  server: { port: 3000 },
});
