import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "prompt",
      includeAssets: ["favicon.ico", "robots.txt", "icon-192.png"],
      manifest: {
        name: "Year-End Review Board",
        short_name: "Review Board",
        description:
          "연말 회고 보드 - 한 해를 돌아보고 새로운 시작을 계획하세요.",
        theme_color: "#6366f1",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        scope: "/",
        icons: [
          {
            src: "/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      workbox: {
        // 핵심: 사용자 승인 전까지 새 SW가 활성화되지 않도록 설정
        skipWaiting: false,
        clientsClaim: false,
        cleanupOutdatedCaches: true,
        navigateFallback: "/index.html",
      },
      // 명시적 등록으로 자동 활성화 방지
      injectRegister: "script",
      devOptions: {
        enabled: false,
      },
    }),
  ],
});
