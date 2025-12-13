import React, { useEffect, useState } from "react";

interface NicknameModalProps {
  isOpen: boolean;
  defaultValue: string;
  title?: string;
  description?: string;
  confirmText?: string;
  isBusy?: boolean;
  onConfirm: (nickname: string) => void;
  onClose: () => void;
}

export const NicknameModal: React.FC<NicknameModalProps> = ({
  isOpen,
  defaultValue,
  title = "닉네임 설정",
  description = "협업세션에서 사용할 닉네임을 입력해주세요.",
  confirmText = "계속",
  isBusy = false,
  onConfirm,
  onClose,
}) => {
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    if (isOpen) {
      setNickname("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const submit = () => {
    const v = nickname.trim();
    if (!v || isBusy) return;
    onConfirm(v);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && nickname.trim() && !isBusy) {
      submit();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={() => {
        if (!isBusy) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
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
        <h2
          style={{
            margin: 0,
            color: "var(--text-primary)",
            fontSize: "1.5rem",
          }}
        >
          {title}
        </h2>
        <p
          style={{
            marginTop: "8px",
            marginBottom: "16px",
            color: "var(--text-secondary)",
            fontSize: "0.95rem",
          }}
        >
          {description}
        </p>

        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="닉네임을 입력해주세요"
          disabled={isBusy}
          autoFocus
          style={{
            marginTop: "12px",
            width: "100%",
            padding: "12px 14px",
            borderRadius: "10px",
            border: "1px solid var(--border-color)",
            backgroundColor: "var(--bg-secondary)",
            color: "var(--text-primary)",
            fontSize: "1rem",
            boxSizing: "border-box",
            fontFamily: "inherit",
          }}
        />

        <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
          <button
            type="button"
            onClick={submit}
            disabled={!nickname.trim() || isBusy}
            style={{
              flex: 1,
              padding: "12px 16px",
              borderRadius: "10px",
              border: "none",
              backgroundColor: "var(--indigo)",
              color: "#fff",
              fontWeight: 700,
              cursor: !nickname.trim() || isBusy ? "not-allowed" : "pointer",
              opacity: !nickname.trim() || isBusy ? 0.6 : 1,
              transition: "all 0.2s ease",
            }}
          >
            {isBusy ? "처리 중..." : confirmText}
          </button>

          <button
            type="button"
            onClick={() => {
              if (!isBusy) onClose();
            }}
            disabled={isBusy}
            style={{
              flex: 1,
              padding: "12px 16px",
              borderRadius: "10px",
              border: "1px solid var(--border-color)",
              backgroundColor: "transparent",
              color: "var(--text-primary)",
              fontWeight: 700,
              cursor: isBusy ? "not-allowed" : "pointer",
              opacity: isBusy ? 0.6 : 1,
              transition: "all 0.2s ease",
            }}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};
