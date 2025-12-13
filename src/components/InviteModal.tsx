import React, { useState } from "react";

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

  if (!isOpen || !inviteCode) return null;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    onCopySuccess?.(); // ✅ 있으면 호출
    window.setTimeout(() => setCopied(false), 1500);
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
        <h2 style={{ margin: 0, color: "var(--text-primary)" }}>초대 코드</h2>

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
