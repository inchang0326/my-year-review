import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "prompt", // 새로운 SW(Service Worker) 발견 시, autoUpdate: 백그라운드 설치 + 즉시 업데이트, prompt: 유저의 선택에 따름(디폴트)
      includeAssets: [
        // manifest 외 정적 자산을 캐시에 포함
        "favicon.ico", // 브라우저 탭/북마크 아이콘 (public/favicon.ico)
        "robots.txt", // 크롤러 규칙 파일 (public/robots.txt)
        "budget-app-apple-touch-icon.png", // iOS 홈 화면 아이콘 (public/budget-app-apple-touch-icon.png)
      ],
      manifest: {
        // 웹 앱 매니페스트 (설치 메타 정보)
        name: "Year-End Review Board", // 설치 시 전체 이름
        short_name: "Review Board", // 홈 화면에 보일 짧은 이름
        description:
          "연말 회고 보드 - 한 해를 돌아보고 새로운 시작을 계획하세요.", // 스토어/설치 정보 등에서 표시
        theme_color: "#6366f1", // 브라우저 UI 테마색
        background_color: "#ffffff", // 스플래시 배경색
        display: "standalone", // 앱처럼 보이기(주소창 숨김)
        start_url: "/", // 앱 시작 경로(서브경로 배포면 '/subpath/')
        scope: "/", // 서비스워커 영향 범위(서브경로 배포면 '/subpath/')
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
        skipWaiting: false, // 대기 없이 새 SW 활성화 여부: registerType가 autoUpdate면 true / prompt면 false 조합
        clientsClaim: false, // 새 SW가 즉시 페이지 제어 여부: registerType가 autoUpdate면 true / prompt면 false 조합
        cleanupOutdatedCaches: true, // 예전 캐시 정리
        // Workbox 설정(런타임 캐싱 전략 + SPA 라우팅 처리)
        navigateFallback: "/index.html", // 브라우저가 직접 라우트로 접근(새로고침/딥링크) 시 index.html 반환 → SPA 404 방지
      },
      // 개발 서버에서도 SW를 강제로 켜고 싶다면 true
      // 단, HMR/캐시 혼동이 잦아 일반적으로 배포 빌드/프리뷰에서 검증 권장
      devOptions: {
        enabled: false,
      },
    }),
  ],
});
