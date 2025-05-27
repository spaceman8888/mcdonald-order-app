// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/mcdonald-order-app/", // GitHub Pages 배포를 위한 base 경로
});
