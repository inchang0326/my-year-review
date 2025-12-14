import React, { useMemo, useState } from "react";

interface InviteModalProps {
  isOpen: boolean;
  inviteCode: string | null;
  onClose: () => void;
  onCopySuccess?: () => void; // ✅ optional로 추가
}

export const InviteModal: React.FC<InviteModalProps> = ({
  isOpen,
  inviteCode,
  onClose,
  onCopySuccess,
}) => {
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const inviteUrl = useMemo(() => {
    // 배포 경로가 /가 아닐 수도 있으니, 현재 URL 기반으로 invite만 붙입니다.
    if (!inviteCode) return "";
    const url = new URL(window.location.href);
    url.searchParams.set("invite", inviteCode);
    return url.toString();
  }, [inviteCode]);

  const handleCopyLink = async () => {
    if (!inviteCode) return;
    await navigator.clipboard.writeText(inviteUrl);
    setLinkCopied(true);
    onCopySuccess?.();
    window.setTimeout(() => setLinkCopied(false), 1500);
  };

  const ensureKakaoInitialized = (jsKey: string): boolean => {
    const w = window as any;
    if (!w.Kakao) return false;

    if (!w.Kakao.isInitialized()) {
      w.Kakao.init(jsKey);
    }
    return !!w.Kakao.isInitialized();
  };

  const handleShareKakao = () => {
    if (!inviteCode) return;

    const jsKey = import.meta.env.VITE_KAKAO_JS_KEY as string | undefined;
    if (!jsKey) {
      alert("VITE_KAKAO_JS_KEY가 설정되어 있지 않습니다.");
      return;
    }

    const ok = ensureKakaoInitialized(jsKey);
    if (!ok) {
      alert(
        "카카오 SDK 로드/초기화에 실패했습니다. index.html SDK 로드 여부를 확인하세요."
      );
      return;
    }

    // Kakao.Share.sendDefault()로 텍스트 템플릿 공유 [web:86]
    (window as any).Kakao.Share.sendDefault({
      objectType: "text",
      text: `Year-End Review 협업 초대\n\n초대코드: ${inviteCode}\n\n참여 링크: ${inviteUrl}`,
      link: {
        mobileWebUrl: inviteUrl,
        webUrl: inviteUrl,
      },
      buttonTitle: "참여하기",
    });
  };

  const handleShareSms = () => {
    if (!inviteCode) return;

    const message = `회고 보드 협업 초대\n초대코드: ${inviteCode}\n링크: ${inviteUrl}`;

    const encoded = encodeURIComponent(message);
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);

    // iOS는 ';body=', Android는 '?body=' 형태가 더 잘 동작하는 케이스가 있어 분기 [web:37]
    const smsUrl = isIOS ? `sms:&body=${encoded}` : `sms:?body=${encoded}`;
    window.location.href = smsUrl;
  };

  if (!isOpen || !inviteCode) return null;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    onCopySuccess?.(); // ✅ 있으면 호출
    window.setTimeout(() => setCopied(false), 1500);
  };

  const styles: Record<string, React.CSSProperties> = {
    shareRow: {
      display: "grid",
      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
      gap: "8px",
      width: "100%",
    },
    shareBtn: {
      width: "100%",
      height: 44, // 버튼 높이 고정하면 3개가 정렬이 깔끔합니다.
      borderRadius: "10px",
      border: "1px solid var(--border-color)",
      backgroundColor: "var(--bg-card)",
      color: "var(--text-primary)",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 0,
    },
    icon: {
      width: 22,
      height: 22,
      objectFit: "contain", // 아이콘 비율 유지 [web:165]
      display: "block",
    },
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 5000,
        padding: "16px",
        boxSizing: "border-box",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(420px, 100%)",
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          borderRadius: "16px",
          boxShadow: "var(--shadow-lg)",
          padding: "20px",
        }}
      >
        <h2 style={{ margin: 0, color: "var(--text-primary)" }}>초대코드</h2>

        <p style={{ marginTop: "8px", color: "var(--text-secondary)" }}>
          아래 코드를 공유하면 동일 보드에 함께 편집할 수 있습니다.
        </p>

        <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
          <input
            readOnly
            value={inviteCode}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid var(--border-color)",
              backgroundColor: "var(--bg-secondary)",
              color: "var(--text-primary)",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textAlign: "center",
              boxSizing: "border-box",
            }}
          />
          <button
            type="button"
            onClick={handleCopy}
            style={{
              padding: "12px 14px",
              borderRadius: "10px",
              border: "none",
              backgroundColor: "var(--indigo)",
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {copied ? "복사됨" : "복사"}
          </button>
        </div>

        <div style={{ marginTop: "12px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(72px, 1fr))",
              gap: "8px",
              width: "100%",
            }}
          >
            {/* 링크 복사 */}
            <button
              type="button"
              onClick={handleCopyLink}
              title={linkCopied ? "초대링크 복사됨" : "초대링크 복사"}
              aria-label={linkCopied ? "초대링크 복사됨" : "초대링크 복사"}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid var(--border-color)",
                backgroundColor: "var(--bg-card)",
                color: "var(--text-primary)",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              {linkCopied ? "🔗✓" : "🔗"}
            </button>

            {/* 카카오톡 공유 */}
            <button
              type="button"
              onClick={handleShareKakao}
              style={styles.shareBtn}
            >
              <img src="/kakaotalk.svg" alt="카카오톡" style={styles.icon} />
            </button>

            {/* 문자 공유 */}
            <button
              type="button"
              onClick={handleShareSms}
              style={styles.shareBtn}
            >
              <img src="/SMS.png" alt="문자" style={styles.icon} />
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          style={{
            marginTop: "12px",
            width: "100%",
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid var(--border-color)",
            backgroundColor: "transparent",
            color: "var(--text-primary)",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          닫기
        </button>
      </div>
    </div>
  );
};
