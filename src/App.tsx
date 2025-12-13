import React, { useEffect, useMemo, useState } from "react";
import { Header } from "./components/Header";
import { YearSelector } from "./components/YearSelector";
import { ReviewBoard } from "./components/ReviewBoard";
import { ThemeToggle } from "./components/ThemeToggle";
import { InviteModal } from "./components/InviteModal";
import { JoinModal } from "./components/JoinModal";
import { CollaboratorsList } from "./components/CollaboratorsList";
import { NicknameModal } from "./components/NicknameModal";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useFirebase } from "./hooks/useFirebase";
import type { ReviewItem, ReviewCategory, YearReview, Theme } from "./types";
import { CURRENT_YEAR, STORAGE_KEYS } from "./utils/constants";
import "./styles/globals.css";

export const App: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<number>(CURRENT_YEAR);

  // 개인 모드
  const [reviews, setReviews] = useLocalStorage<YearReview[]>(
    STORAGE_KEYS.REVIEWS,
    []
  );
  const [theme, setTheme] = useLocalStorage<Theme>(STORAGE_KEYS.THEME, "light");
  const [soloNickname, setSoloNickname] = useLocalStorage<string>(
    STORAGE_KEYS.SOLO_NICKNAME,
    "익명 사용자"
  );

  // 협업 모드에서 사용할 “이번 세션 닉네임”
  const [collabNickname, setCollabNickname] = useState<string | null>(null);

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
  } = useFirebase();

  const [showNicknameModal, setShowNicknameModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  const [inviteCode, setInviteCode] = useState<string | null>(null);

  // 테마
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // 초대코드가 잡히면 모달 자동 오픈
  useEffect(() => {
    if (inviteCode) setShowInviteModal(true);
  }, [inviteCode]);

  // 현재 아이템: 개인/협업 엄격 분리
  const currentItems: ReviewItem[] = useMemo(() => {
    if (session) return session.items || [];
    const yr = reviews.find((r) => r.year === selectedYear);
    return yr?.items || [];
  }, [reviews, selectedYear, session]);

  // 협업 작성자 이름: collabNickname 우선, 없으면 세션에서 내 collaborator 이름 fallback
  const myNameFromSession = useMemo(() => {
    if (!user?.userId) return null;
    return collaborators.find((c) => c.userId === user.userId)?.name ?? null;
  }, [collaborators, user?.userId]);

  const effectiveCollabName = useMemo(() => {
    return (
      collabNickname?.trim() ||
      myNameFromSession?.trim() ||
      "익명 사용자"
    ).trim();
  }, [collabNickname, myNameFromSession]);

  const handleToggleTheme = () =>
    setTheme((p) => (p === "light" ? "dark" : "light"));

  // 협업 시작 버튼 -> 닉네임 먼저
  const handleStartCollab = () => {
    clearError();
    setShowNicknameModal(true);
  };

  // 닉네임 확정 -> 세션 생성 -> 초대코드 모달
  const handleNicknameConfirm = async (nickname: string) => {
    clearError();
    setShowNicknameModal(false);

    setCollabNickname(nickname);

    const code = await createSession(selectedYear, nickname);
    if (code) setInviteCode(code);
  };

  // 초대코드로 참여
  const handleJoin = async (
    code: string,
    nickname: string
  ): Promise<boolean> => {
    clearError();
    setCollabNickname(nickname);

    const ok = await joinSession(code, nickname);
    if (ok) {
      setInviteCode(code);
      setShowJoinModal(false);
    }
    return ok;
  };

  // 나가기: 마지막 사용자면 삭제 confirm
  const handleLeaveSession = async () => {
    clearError();
    if (!session?.id) return;

    const isLast = collaborators.length <= 1;
    if (isLast) {
      const shouldDelete = window.confirm(
        "마지막 참여자입니다.\n이 협업 세션을 삭제(파기)하시겠습니까?"
      );

      await leaveSession(session.id);
      if (shouldDelete) await deleteSession(session.id);
    } else {
      await leaveSession(session.id);
    }

    // 협업 닉네임/코드 초기화 -> 개인 모드 복귀 시 개인 닉네임 사용
    setCollabNickname(null);
    setInviteCode(null);
    setShowInviteModal(false);
  };

  // 아이템 추가: 개인/협업 엄격 분리 + 협업에서는 협업 닉네임 사용
  const handleAddItem = async (category: ReviewCategory, content: string) => {
    if (session) {
      await addItem(category, content, effectiveCollabName); // ✅ 개인 닉네임이 아니라 협업 닉네임 사용
      return;
    }

    const newItem: ReviewItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      category,
      content,
      createdAt: Date.now(),
      createdBy: soloNickname,
    };

    setReviews((prev) => {
      const idx = prev.findIndex((r) => r.year === selectedYear);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], items: [...next[idx].items, newItem] };
        return next;
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
      <div
        style={{
          position: "fixed",
          top: "1rem",
          right: "1rem",
          zIndex: 1000,
          display: "flex",
          gap: "0.75rem",
          alignItems: "center",
        }}
      >
        <ThemeToggle theme={theme} onToggle={handleToggleTheme} />
        {!session && (
          <button
            onClick={() => setShowJoinModal(true)}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "0.5rem",
              border: "1px solid var(--border-color)",
              backgroundColor: "var(--bg-card)",
              color: "var(--text-primary)",
              fontSize: "0.875rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
            title="초대 코드로 협업 시작"
          >
            👥 참여
          </button>
        )}
      </div>

      <Header selectedYear={selectedYear} />

      {/* 협업 모드 배너 + 나가기 버튼(이제 session이 채워져 정상 노출) */}
      {session && (
        <div
          style={{
            backgroundColor: "var(--indigo)",
            color: "#ffffff",
            padding: "1rem",
            textAlign: "center",
            fontSize: "0.95rem",
            fontWeight: 500,
          }}
        >
          🔗 협업 모드 활성화 (초대 코드: <strong>{session.id}</strong>)
          <button
            onClick={() => setShowInviteModal(true)}
            style={{
              marginLeft: "1rem",
              padding: "0.4rem 0.8rem",
              borderRadius: "0.4rem",
              border: "none",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              color: "#ffffff",
              cursor: "pointer",
              fontSize: "0.875rem",
              fontWeight: 700,
            }}
          >
            📋 초대 코드
          </button>
          <button
            onClick={handleLeaveSession}
            style={{
              marginLeft: "0.5rem",
              padding: "0.4rem 0.8rem",
              borderRadius: "0.4rem",
              border: "none",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              color: "#ffffff",
              cursor: "pointer",
              fontSize: "0.875rem",
              fontWeight: 700,
            }}
          >
            🚪 나가기
          </button>
        </div>
      )}

      {/* 참여자 노출(이제 collaborators가 채워져 정상 노출) */}
      {session && (
        <div
          style={{
            padding: "1rem",
            backgroundColor: "var(--bg-secondary)",
            borderBottom: "1px solid var(--border-color)",
          }}
        >
          <p
            style={{
              margin: "0 0 0.75rem 0",
              color: "var(--text-secondary)",
              fontSize: "0.875rem",
              fontWeight: 500,
            }}
          >
            참여자 {collaborators.length}명
          </p>
          {collaborators.length > 0 && (
            <CollaboratorsList collaborators={collaborators} />
          )}
        </div>
      )}

      <YearSelector
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
      />

      {/* 개인 모드일 때만 협업 시작 섹션 노출 */}
      {!session && (
        <div
          style={{
            textAlign: "center",
            padding: "2rem",
            backgroundColor: "var(--bg-secondary)",
          }}
        >
          <p style={{ color: "var(--text-secondary)", marginBottom: "1rem" }}>
            협업 세션 시작 전, 닉네임을 먼저 설정합니다.
          </p>
          <button
            onClick={handleStartCollab}
            disabled={!authReady}
            style={{
              padding: "0.75rem 1.5rem",
              borderRadius: "0.5rem",
              border: "none",
              backgroundColor: "var(--indigo)",
              color: "#ffffff",
              fontSize: "1rem",
              fontWeight: 700,
              cursor: authReady ? "pointer" : "not-allowed",
              opacity: authReady ? 1 : 0.6,
            }}
          >
            🚀 협업 세션 시작
          </button>

          {/* 개인 닉네임 입력(개인 모드에만 영향) */}
          <div
            style={{
              marginTop: "1rem",
              color: "var(--text-secondary)",
              fontSize: "0.875rem",
            }}
          >
            <div style={{ marginBottom: "0.5rem" }}>개인 모드 닉네임</div>
            <input
              value={soloNickname === "익명 사용자" ? "" : soloNickname}
              onChange={(e) =>
                setSoloNickname(e.target.value.trim() || "익명 사용자")
              }
              placeholder="(개인 모드) 닉네임을 입력하세요"
              style={{
                width: "min(320px, 90%)",
                padding: "10px 12px",
                borderRadius: "10px",
                border: "1px solid var(--border-color)",
                backgroundColor: "var(--bg-card)",
                color: "var(--text-primary)",
                boxSizing: "border-box",
              }}
            />
          </div>
        </div>
      )}

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
            backgroundColor: "var(--rose)",
            color: "#ffffff",
            padding: "1rem",
            borderRadius: "0.5rem",
            fontSize: "0.875rem",
            zIndex: 6000,
          }}
        >
          ❌ {error}
        </div>
      )}

      <NicknameModal
        isOpen={showNicknameModal}
        defaultValue={soloNickname}
        title="협업 닉네임 설정"
        description="이번 협업 세션에서 사용할 닉네임을 입력해주세요."
        confirmText="세션 만들기"
        onConfirm={handleNicknameConfirm}
        onClose={() => setShowNicknameModal(false)}
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
