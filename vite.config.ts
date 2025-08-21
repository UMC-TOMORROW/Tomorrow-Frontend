import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // 서버 Nginx가 /wss를 백엔드로 넘기도록 설정돼 있어야 함
      "/wss": {
        target: "https://umctomorrow.shop",
        changeOrigin: true,
        secure: false,
        ws: true,
      },

      "/api": {
        target: "https://umctomorrow.shop",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  define: {
    global: "window", // 일부 라이브러리 호환
  },
});
