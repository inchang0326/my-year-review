import { useRegisterSW } from "virtual:pwa-register/react"; // 플러그인 제공 Servie Worker 등록 Hook
import { useState } from "react";

export const usePWA = () => {
  const [needRefresh, setNeedRefresh] = useState(false); // 새 버전 감지 시(코드 수정된 후 재 배포 시 - npm run build) true

  console.log(needRefresh);
  const { updateServiceWorker } = useRegisterSW({
    onNeedRefresh() {
      // 새 SW가 설치됐고 대기 중일 때 호출
      setNeedRefresh(true);
    },
  });

  const confirmUpdate = () => {
    // true 전달 시 대기 중인 Service Worker를 즉시 활성화하고 페이지를 리로드
    updateServiceWorker(true);
  };

  return { needRefresh, confirmUpdate };
};
