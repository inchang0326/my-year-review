import { useRegisterSW } from "virtual:pwa-register/react";
import { useState, useRef } from "react";

export const usePWA = () => {
  const [needRefresh, setNeedRefresh] = useState(false);
  const registrationRef = useRef<ServiceWorkerRegistration | null>(null);

  const { updateServiceWorker } = useRegisterSW({
    onRegistered(reg: ServiceWorkerRegistration | undefined) {
      // undefined 체크
      if (!reg) {
        console.error("❌ SW Registration failed");
        return;
      }

      console.log("✅ SW Registered:", reg);
      registrationRef.current = reg;

      // 대기 중인 SW가 있으면 업데이트 알림
      if (reg.waiting) {
        console.log("🔔 업데이트 대기 중");
        setNeedRefresh(true);
      }

      // 새로운 SW가 설치되면 감지
      reg.addEventListener("updatefound", () => {
        const newWorker = reg.installing;
        newWorker?.addEventListener("statechange", () => {
          if (
            newWorker.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            console.log("🔔 새로운 버전 감지");
            setNeedRefresh(true);
          }
        });
      });
    },
    onNeedRefresh() {
      console.log("🔔 새로운 버전 감지");
      setNeedRefresh(true);
    },
  });

  const confirmUpdate = () => {
    console.log("🔄 업데이트 시작");
    setNeedRefresh(false);
    updateServiceWorker(true);
  };

  const dismissUpdate = () => {
    console.log("❌ 업데이트 거부 - 대기 중인 SW 비활성화");
    setNeedRefresh(false);

    // 대기 중인 SW에 메시지 전송
    if (registrationRef.current?.waiting) {
      registrationRef.current.waiting.postMessage({
        type: "SKIP_WAITING",
      });
      console.log("📤 SKIP_WAITING 메시지 전송");
    }
  };

  return { needRefresh, confirmUpdate, dismissUpdate };
};
