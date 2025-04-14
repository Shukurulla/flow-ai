import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  define: {
    "process.env": process.env, // Environment o'zgaruvchilarini ishlatish uchun
  },
  server: {
    proxy: {
      "/api": {
        target: "https://akkanat.pythonanywhere.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
