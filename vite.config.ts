import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  assetsInclude: ["**/*.jpg", "**/*.png", "**/*.jpeg", "**/*.gif"],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: "/mcdonald-order-app/", // GitHub Pages 배포를 위한 base 경로
});
