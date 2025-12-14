// src/utils/share.ts
export function buildInviteUrl(inviteCode: string): string {
  const url = new URL(window.location.href);
  url.pathname = "/";
  url.searchParams.set("invite", inviteCode);
  return url.toString();
}

// iOS/Android에서 sms: URI의 body 파라미터 구분자가 달라질 수 있어 분기합니다. [web:37]
export function openSmsShare(message: string): void {
  const encoded = encodeURIComponent(message);
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const smsUrl = isIOS ? `sms:&body=${encoded}` : `sms:?body=${encoded}`;
  window.location.href = smsUrl;
}

export function ensureKakaoInitialized(kakaoJsKey: string): boolean {
  const w = window as unknown as { Kakao?: any };
  if (!w.Kakao) return false;

  if (!w.Kakao.isInitialized()) {
    w.Kakao.init(kakaoJsKey);
  }
  return !!w.Kakao.isInitialized();
}

// 커스텀 버튼에서 공유를 보내려면 Kakao.Share.sendDefault를 사용합니다. [web:39]
export function shareKakaoText(params: {
  kakaoJsKey: string;
  title: string;
  text: string;
  webUrl: string;
}): boolean {
  const w = window as unknown as { Kakao?: any };
  const ok = ensureKakaoInitialized(params.kakaoJsKey);
  if (!ok) return false;

  w.Kakao.Share.sendDefault({
    objectType: "text",
    text: `${params.title}\n\n${params.text}\n\n${params.webUrl}`,
    link: {
      mobileWebUrl: params.webUrl,
      webUrl: params.webUrl,
    },
  });

  return true;
}
