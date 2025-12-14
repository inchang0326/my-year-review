import React, { useEffect, useState } from "react";

interface JoinModalProps {
  isOpen: boolean;
  initialInviteCode?: string;
  onJoin: (inviteCode: string) => Promise<boolean>;
  onClose: () => void;
}

export const JoinModal: React.FC<JoinModalProps> = ({
  isOpen,
  initialInviteCode,
  onJoin,
  onClose,
}) => {
  const [inviteCode, setInviteCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    if (initialInviteCode && initialInviteCode.trim()) {
      setInviteCode(initialInviteCode.trim().toUpperCase());
      setError(null);
    }
  }, [isOpen, initialInviteCode]);

  if (!isOpen) return null;

  const handleJoin = async () => {
    if (!inviteCode.trim()) {
      setError("초대코드를 입력해주세요");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const success = await onJoin(inviteCode.toUpperCase());
      if (success) {
        setInviteCode("");
        onClose();
      }
    } catch {
      setError("참여 실패");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 5000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "var(--bg-card)",
          borderRadius: "1rem",
          padding: "2rem",
          maxWidth: "400px",
          boxShadow: "var(--shadow-lg)",
          border: "1px solid var(--border-color)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          style={{
            marginTop: 0,
            marginBottom: "1rem",
            color: "var(--text-primary)",
            fontSize: "1.5rem",
          }}
        >
          🎯 세션 참여
        </h2>

        <div style={{ marginBottom: "1rem" }}>
          <label
            style={{
              display: "block",
              marginBottom: "0.5rem",
              color: "var(--text-secondary)",
              fontSize: "0.875rem",
              fontWeight: "500",
            }}
          >
            초대코드
          </label>
          <input
            type="text"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
            placeholder="예: ABC123"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: "0.5rem",
              border: "1px solid var(--border-color)",
              backgroundColor: "var(--bg-secondary)",
              color: "var(--text-primary)",
              fontSize: "1rem",
              boxSizing: "border-box",
            }}
          />
        </div>

        {error && (
          <p
            style={{
              color: "var(--rose)",
              fontSize: "0.875rem",
              marginBottom: "1rem",
            }}
          >
            ❌ {error}
          </p>
        )}

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            onClick={handleJoin}
            disabled={isLoading}
            style={{
              flex: 1,
              padding: "0.75rem",
              borderRadius: "0.5rem",
              border: "none",
              backgroundColor: "var(--indigo)",
              color: "#ffffff",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: isLoading ? "not-allowed" : "pointer",
              opacity: isLoading ? 0.5 : 1,
            }}
          >
            {isLoading ? "참여 중..." : "참여하기"}
          </button>
          <button
            onClick={onClose}
            disabled={isLoading}
            style={{
              flex: 1,
              padding: "0.75rem",
              borderRadius: "0.5rem",
              border: "1px solid var(--border-color)",
              backgroundColor: "transparent",
              color: "var(--text-primary)",
              fontSize: "1rem",
              cursor: isLoading ? "not-allowed" : "pointer",
              opacity: isLoading ? 0.5 : 1,
            }}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};
