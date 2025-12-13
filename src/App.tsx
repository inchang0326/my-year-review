import React, { useEffect, useMemo, useState } from "react";
import { Header } from "./components/Header";
import { YearSelector } from "./components/YearSelector";
import { ReviewBoard } from "./components/ReviewBoard";
import { InviteModal } from "./components/InviteModal";
import { JoinModal } from "./components/JoinModal";
import { CollaboratorsList } from "./components/CollaboratorsList";
import { SettingsDrawer } from "./components/SettingsDrawer";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useFirebase } from "./hooks/useFirebase";
import type { ReviewItem, ReviewCategory, YearReview, Theme } from "./types";
import { CURRENT_YEAR, STORAGE_KEYS } from "./utils/constants";
import "./styles/globals.css";

export const App: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<number>(CURRENT_YEAR);

  // 개인 모드(로컬)
  const [reviews, setReviews] = useLocalStorage<YearReview[]>(
    STORAGE_KEYS.REVIEWS,
    []
  );
  const [theme, setTheme] = useLocalStorage<Theme>(STORAGE_KEYS.THEME, "light");

  // 닉네임(단일 UX): 개인 작성자명 + 협업 참여자명으로 같이 사용
  const [nickname, setNickname] = useLocalStorage<string>(
    STORAGE_KEYS.SOLO_NICKNAME,
    "익명"
  );

  const {
    user,
    authReady,
    session,
    collaborators,
    error,
    clearError,
    createSession,
    joinSession,
    addItem,
    deleteItem,
    leaveSession,
    deleteSession,
    updateMyCollaboratorName,
  } = useFirebase();

  // UI
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const isCollabActive = !!session;

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // 초대코드 잡히면 모달 오픈
  useEffect(() => {
    if (inviteCode) setShowInviteModal(true);
  }, [inviteCode]);

  const currentItems: ReviewItem[] = useMemo(() => {
    if (session) return session.items || [];
    const yr = reviews.find((r) => r.year === selectedYear);
    return yr?.items || [];
  }, [reviews, selectedYear, session]);

  const handleToggleTheme = () =>
    setTheme((p) => (p === "light" ? "dark" : "light"));

  // 닉네임 확인(설정에서)
  const handleConfirmNickname = async (next: string) => {
    const v = next.trim() || "익명";
    setNickname(v);

    // 협업 중이면 참여자명도 즉시 업데이트
    if (session?.id) {
      await updateMyCollaboratorName(session.id, v);
    }
  };

  const handleSelectSoloMode = async () => {
    clearError();
    setShowSettings(false);

    if (!session?.id) return;

    const isLast = collaborators.length <= 1;
    if (isLast) {
      const shouldDelete = window.confirm(
        "마지막 참여자입니다.\n해당 세션을 삭제하시겠습니까?"
      );
      await leaveSession(session.id);
      if (shouldDelete) await deleteSession(session.id);
    } else {
      await leaveSession(session.id);
    }

    setInviteCode(null);
    setShowInviteModal(false);
  };

  const handleCreateCollab = async () => {
    clearError();
    setShowSettings(false);

    if (!authReady) return;

    const code = await createSession(selectedYear, nickname);
    if (code) setInviteCode(code);
  };

  const handleOpenJoin = () => {
    clearError();
    setShowSettings(false);
    setShowJoinModal(true);
  };

  // ✅ 버그 수정: 협업모드 참여 시 JoinModal에서 입력한 닉네임을 사용
  const handleJoin = async (code: string): Promise<boolean> => {
    clearError();

    const v = nickname.trim();

    const ok = await joinSession(code, v);
    if (ok) {
      setInviteCode(code);
      setShowJoinModal(false);
    }
    return ok;
  };

  const handleOpenInviteCode = () => {
    setShowSettings(false);
    setShowInviteModal(true);
  };

  const handleLeaveSession = async () => {
    setShowSettings(false);
    await handleSelectSoloMode();
  };

  const handleAddItem = async (category: ReviewCategory, content: string) => {
    if (session) {
      await addItem(category, content, nickname);
      return;
    }

    const newItem: ReviewItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      category,
      content,
      createdAt: Date.now(),
      createdBy: nickname,
    };

    setReviews((prev) => {
      const idx = prev.findIndex((r) => r.year === selectedYear);
      if (idx >= 0) {
        const nextArr = [...prev];
        nextArr[idx] = {
          ...nextArr[idx],
          items: [...nextArr[idx].items, newItem],
        };
        return nextArr;
      }
      return [...prev, { year: selectedYear, items: [newItem] }];
    });
  };

  const handleDeleteItem = async (id: string) => {
    if (session) {
      await deleteItem(id);
      return;
    }

    setReviews((prev) =>
      prev.map((r) =>
        r.year === selectedYear
          ? { ...r, items: r.items.filter((it) => it.id !== id) }
          : r
      )
    );
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-primary)" }}>
      <Header
        selectedYear={selectedYear}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenMenu={() => setShowSettings(true)}
      />

      {/* 협업 중일 때만 참여자 표시(설명 문구 없이 최소 UI) */}
      {session && (
        <div
          style={{
            padding: "12px 16px",
            backgroundColor: "var(--bg-secondary)",
            borderBottom: "1px solid var(--border-color)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
            }}
          >
            <div
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.875rem",
                fontWeight: 800,
              }}
            >
              {collaborators.length}명
            </div>
          </div>

          {collaborators.length > 0 && (
            <div style={{ marginTop: "10px" }}>
              <CollaboratorsList collaborators={collaborators} />
            </div>
          )}
        </div>
      )}

      <YearSelector
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
      />

      <ReviewBoard
        items={currentItems}
        onAddItem={handleAddItem}
        onDeleteItem={handleDeleteItem}
      />

      {error && (
        <div
          style={{
            position: "fixed",
            bottom: "1rem",
            left: "1rem",
            right: "1rem",
            backgroundColor: "var(--rose)",
            color: "#ffffff",
            padding: "1rem",
            borderRadius: "12px",
            fontSize: "0.875rem",
            zIndex: 8000,
          }}
        >
          ❌ {error}
        </div>
      )}

      <SettingsDrawer
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        nickname={nickname}
        onConfirmNickname={handleConfirmNickname}
        isCollabActive={isCollabActive}
        onSelectSoloMode={handleSelectSoloMode}
        onCreateCollab={handleCreateCollab}
        onOpenJoin={handleOpenJoin}
        onOpenInviteCode={handleOpenInviteCode}
        onLeaveSession={handleLeaveSession}
      />

      <InviteModal
        isOpen={showInviteModal}
        inviteCode={inviteCode ?? session?.id ?? null}
        onClose={() => setShowInviteModal(false)}
      />

      <JoinModal
        isOpen={showJoinModal}
        onJoin={handleJoin}
        onClose={() => setShowJoinModal(false)}
      />
    </div>
  );
};
