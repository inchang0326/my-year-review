import React, { useEffect, useMemo, useState } from "react";

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;

  // 닉네임 (표시/편집)
  nickname: string; // 표시용(빈값이면 "익명"으로 보여도 됨)
  onConfirmNickname: (next: string) => Promise<void> | void;

  // 협업 상태
  isCollabActive: boolean;
  sessionId?: string;

  // 메뉴 액션
  onSelectSoloMode: () => void;
  onCreateCollab: () => void; // "협업모드 만들기"
  onOpenJoin: () => void; // "협업모드 참여"
  onOpenInviteCode: () => void;
  onLeaveSession: () => void;
}

export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({
  isOpen,
  onClose,
  nickname,
  onConfirmNickname,
  isCollabActive,
  sessionId,
  onSelectSoloMode,
  onCreateCollab,
  onOpenJoin,
  onOpenInviteCode,
  onLeaveSession,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(nickname);
  const [busy, setBusy] = useState(false);

  const displayName = useMemo(() => {
    const v = (nickname || "").trim();
    return v ? v : "익명";
  }, [nickname]);

  useEffect(() => {
    if (!isOpen) return;
    setIsEditing(false);
    setBusy(false);
    setDraft(nickname);
  }, [isOpen, nickname]);

  if (!isOpen) return null;

  const startEdit = () => {
    setDraft(displayName === "익명" ? "" : displayName);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setDraft(nickname);
  };

  const confirm = async () => {
    const next = draft.trim() || "익명";
    setBusy(true);
    try {
      await onConfirmNickname(next);
      setIsEditing(false);
    } finally {
      setBusy(false);
    }
  };

  const MenuButton = ({
    children,
    onClick,
    primary,
    disabled,
  }: {
    children: React.ReactNode;
    onClick: () => void;
    primary?: boolean;
    disabled?: boolean;
  }) => (
    <button
      type="button"
      disabled={disabled || busy}
      onClick={onClick}
      style={{
        width: "100%",
        padding: "12px",
        borderRadius: "12px",
        border: primary ? "none" : "1px solid var(--border-color)",
        backgroundColor: primary ? "var(--indigo)" : "transparent",
        color: primary ? "#fff" : "var(--text-primary)",
        fontWeight: 950,
        cursor: disabled || busy ? "not-allowed" : "pointer",
        opacity: disabled || busy ? 0.6 : 1,
      }}
    >
      {children}
    </button>
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={() => {
        if (!busy) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 7000,
        backgroundColor: "rgba(0,0,0,0.45)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          height: "100%",
          width: "min(360px, 92vw)",
          backgroundColor: "var(--bg-card)",
          borderLeft: "1px solid var(--border-color)",
          boxShadow: "var(--shadow-lg)",
          padding: "16px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {/* 닉네임(최우선) */}
        <div
          style={{
            padding: "14px",
            borderRadius: "16px",
            border: "1px solid var(--border-color)",
            backgroundColor: "var(--bg-secondary)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isEditing
                ? "minmax(0, 1fr) auto auto" // input + 확인 + 취소
                : "minmax(0, 1fr) auto", // input + 수정
              columnGap: "8px",
              rowGap: "8px",
              alignItems: "center",
              minWidth: 0,
            }}
          >
            <input
              value={isEditing ? draft : displayName}
              readOnly={!isEditing}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="닉네임"
              style={{
                minWidth: 0, // 좁은 화면에서 먼저 줄어들도록
                width: "100%",
                padding: "10px 12px",
                borderRadius: "12px",
                border: "1px solid var(--border-color)",
                backgroundColor: isEditing ? "var(--bg-card)" : "rgba(0,0,0,0)",
                color: "var(--text-primary)",
                fontWeight: 900,
                boxSizing: "border-box",
                outline: "none",
              }}
            />

            {!isEditing ? (
              <button
                type="button"
                onClick={startEdit}
                disabled={busy}
                style={{
                  padding: "10px 12px",
                  borderRadius: "12px",
                  border: "none",
                  backgroundColor: "var(--indigo)",
                  color: "#fff",
                  fontWeight: 950,
                  cursor: busy ? "not-allowed" : "pointer",
                  opacity: busy ? 0.6 : 1,
                  whiteSpace: "nowrap",
                }}
              >
                수정
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={confirm}
                  disabled={busy}
                  style={{
                    padding: "10px 12px",
                    borderRadius: "12px",
                    border: "none",
                    backgroundColor: "var(--indigo)",
                    color: "#fff",
                    fontWeight: 950,
                    cursor: busy ? "not-allowed" : "pointer",
                    opacity: busy ? 0.6 : 1,
                    whiteSpace: "nowrap",
                  }}
                >
                  확인
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  disabled={busy}
                  style={{
                    padding: "10px 12px",
                    borderRadius: "12px",
                    border: "1px solid var(--border-color)",
                    backgroundColor: "transparent",
                    color: "var(--text-primary)",
                    fontWeight: 950,
                    cursor: busy ? "not-allowed" : "pointer",
                    opacity: busy ? 0.6 : 1,
                    whiteSpace: "nowrap",
                  }}
                >
                  취소
                </button>
              </>
            )}
          </div>

          {isCollabActive && sessionId && (
            <div
              style={{
                marginTop: "10px",
                fontSize: "12px",
                color: "var(--text-secondary)",
              }}
            >
              {sessionId}
            </div>
          )}
        </div>

        {/* 메뉴(띄어쓰기 없이 + 만들기/참여 분리) */}
        <div style={{ display: "grid", gap: "8px" }}>
          <MenuButton onClick={onSelectSoloMode}>개인모드</MenuButton>

          {!isCollabActive && (
            <>
              <MenuButton onClick={onCreateCollab}>협업모드 만들기</MenuButton>
              <MenuButton onClick={onOpenJoin}>협업모드 참여</MenuButton>
            </>
          )}

          {isCollabActive && (
            <>
              <MenuButton onClick={onOpenInviteCode}>초대코드</MenuButton>
              <MenuButton onClick={onLeaveSession}>나가기</MenuButton>
            </>
          )}
        </div>

        <div style={{ flex: 1 }} />

        <button
          type="button"
          onClick={() => {
            if (!busy) onClose();
          }}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "14px",
            border: "1px solid var(--border-color)",
            backgroundColor: "transparent",
            color: "var(--text-primary)",
            fontWeight: 950,
            cursor: busy ? "not-allowed" : "pointer",
            opacity: busy ? 0.6 : 1,
          }}
        >
          닫기
        </button>
      </div>
    </div>
  );
};
