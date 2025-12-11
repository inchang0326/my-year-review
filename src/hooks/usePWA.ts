import { useRegisterSW } from "virtual:pwa-register/react";
import { useState, useEffect } from "react";

export const usePWA = () => {
  const [needRefresh, setNeedRefresh] = useState(false);

  const { updateServiceWorker } = useRegisterSW({
    onNeedRefresh() {
      //   console.log("🔔 새로운 버전 감지");
      setNeedRefresh(true);
    },
    onOfflineReady() {
      //   console.log("✅ 오프라인 준비 완료");
    },
    // 즉시 등록하지 않고 지연 등록
    immediate: false,
  });

  const confirmUpdate = async () => {
    // console.log("🔄 업데이트 시작");
    setNeedRefresh(false);
    // 새 SW를 활성화하고 페이지 리로드
    await updateServiceWorker(true);
  };

  const dismissUpdate = () => {
    // console.log("❌ 업데이트 거부");
    setNeedRefresh(false);
  };

  //   console.log("needRefresh 상태:", needRefresh);

  return { needRefresh, confirmUpdate, dismissUpdate };
};
