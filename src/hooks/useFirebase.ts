import { useCallback, useEffect, useState } from "react";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { get, onValue, ref, remove, set, update } from "firebase/database";
import type { Unsubscribe } from "firebase/database";

import { auth, database } from "../utils/firebase";
import type {
  CollaborationSession,
  Collaborator,
  ReviewCategory,
  ReviewItem,
  User,
} from "../types";

function normalizeToArray<T>(value: unknown): T[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean) as T[];
  if (typeof value === "object") {
    return Object.values(value as Record<string, T>).filter(Boolean);
  }
  return [];
}

function getRandomColor(): string {
  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#FFA07A",
    "#98D8C8",
    "#F7DC6F",
    "#BB8FCE",
    "#85C1E2",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

function normalizeSession(
  raw: unknown,
  sessionId: string
): CollaborationSession | null {
  if (!raw || typeof raw !== "object") return null;
  const data = raw as Record<string, unknown>;

  return {
    id: (data.id as string) || sessionId,
    creatorId: (data.creatorId as string) || "",
    creatorName: (data.creatorName as string) || "",
    year: (data.year as number) || new Date().getFullYear(),
    items: normalizeToArray<ReviewItem>(data.items),
    collaborators: normalizeToArray<Collaborator>(data.collaborators),
    createdAt: (data.createdAt as number) || Date.now(),
    expiresAt: (data.expiresAt as number) || 0,
  };
}

export const useFirebase = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);

  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [session, setSession] = useState<CollaborationSession | null>(null);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      try {
        if (!fbUser) {
          await signInAnonymously(auth);
          return;
        }
        setUser({ userId: fbUser.uid, name: `익명-${fbUser.uid.slice(0, 6)}` });
        setAuthReady(true);
      } catch (e) {
        console.error("❌ auth init error:", e);
        setError("사용자 인증 실패");
        setAuthReady(true);
      }
    });

    return () => unsub();
  }, []);

  const clearError = useCallback(() => setError(null), []);

  // activeSessionId가 정해지면 자동 구독
  useEffect(() => {
    if (!activeSessionId) {
      setSession(null);
      setCollaborators([]);
      return;
    }

    const sessionRef = ref(database, `sessions/${activeSessionId}`);
    const unsub: Unsubscribe = onValue(
      sessionRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          setSession(null);
          setCollaborators([]);
          return;
        }
        const normalized = normalizeSession(snapshot.val(), activeSessionId);
        setSession(normalized);
        setCollaborators(normalized?.collaborators ?? []);
      },
      (e) => {
        console.error("❌ listenToSession error:", e);
        setError("세션 동기화 실패");
      }
    );

    return () => unsub();
  }, [activeSessionId]);

  const createSession = useCallback(
    async (year: number, nickname: string): Promise<string | null> => {
      if (!authReady || !user) {
        setError("인증이 준비되지 않았습니다.");
        return null;
      }

      const name = nickname.trim() || "익명";

      try {
        const code = Math.random().toString(36).slice(2, 8).toUpperCase();

        const me: Collaborator = {
          userId: user.userId,
          name,
          joinedAt: Date.now(),
          color: getRandomColor(),
        };

        const sessionData: CollaborationSession = {
          id: code,
          creatorId: user.userId,
          creatorName: name,
          year,
          items: [],
          collaborators: [me],
          createdAt: Date.now(),
          expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
        };

        await set(ref(database, `sessions/${code}`), {
          ...sessionData,
          items: {},
          collaborators: { [me.userId]: me },
        });

        setActiveSessionId(code);
        return code;
      } catch (e) {
        console.error("❌ createSession error:", e);
        setError("세션 생성 실패");
        return null;
      }
    },
    [authReady, user]
  );

  const joinSession = useCallback(
    async (inviteCode: string, nickname: string): Promise<boolean> => {
      if (!authReady || !user) {
        setError("인증이 준비되지 않았습니다.");
        return false;
      }

      const code = inviteCode.trim().toUpperCase();
      const name = nickname.trim();

      try {
        const sessionRef = ref(database, `sessions/${code}`);
        const snapshot = await get(sessionRef);

        if (!snapshot.exists()) {
          setError("존재하지 않는 세션입니다.");
          return false;
        }

        const me: Collaborator = {
          userId: user.userId,
          name,
          joinedAt: Date.now(),
          color: getRandomColor(),
        };

        await set(
          ref(database, `sessions/${code}/collaborators/${me.userId}`),
          me
        );
        setActiveSessionId(code);
        return true;
      } catch (e) {
        console.error("❌ joinSession error:", e);
        setError("세션 참여 실패");
        return false;
      }
    },
    [authReady, user]
  );

  const addItem = useCallback(
    async (category: ReviewCategory, content: string, createdBy: string) => {
      if (!session) return;

      const name = createdBy.trim() || "익명";

      const newItem: ReviewItem = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        category,
        content,
        createdAt: Date.now(),
        createdBy: name,
      };

      try {
        await set(
          ref(database, `sessions/${session.id}/items/${newItem.id}`),
          newItem
        );
      } catch (e) {
        console.error("❌ addItem error:", e);
        setError("아이템 추가 실패");
      }
    },
    [session]
  );

  const deleteItem = useCallback(
    async (itemId: string): Promise<void> => {
      if (!session) return;

      try {
        await remove(ref(database, `sessions/${session.id}/items/${itemId}`));
      } catch (e) {
        console.error("❌ deleteItem error:", e);
        setError("아이템 삭제 실패");
      }
    },
    [session]
  );

  const leaveSession = useCallback(
    async (sessionId: string): Promise<void> => {
      if (!user) return;

      try {
        await remove(
          ref(database, `sessions/${sessionId}/collaborators/${user.userId}`)
        );
      } catch (e) {
        console.error("❌ leaveSession error:", e);
        setError("세션 나가기 실패");
      } finally {
        setActiveSessionId(null);
      }
    },
    [user]
  );

  const deleteSession = useCallback(
    async (sessionId: string): Promise<void> => {
      try {
        await remove(ref(database, `sessions/${sessionId}`));
      } catch (e) {
        console.error("❌ deleteSession error:", e);
        setError("세션 삭제 실패");
      }
    },
    []
  );

  // ✅ 닉네임 실시간 변경(세션 참여 중일 때)
  const updateMyCollaboratorName = useCallback(
    async (sessionId: string, nickname: string): Promise<void> => {
      if (!user) return;

      const name = nickname.trim() || "익명";

      try {
        // name만 부분 업데이트(기존 joinedAt/color 유지)
        await update(
          ref(database, `sessions/${sessionId}/collaborators/${user.userId}`),
          {
            name,
          }
        );
      } catch (e) {
        console.error("❌ updateMyCollaboratorName error:", e);
        setError("닉네임 변경 실패");
      }
    },
    [user]
  );

  return {
    user,
    authReady,
    activeSessionId,
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
    updateMyCollaboratorName, // ✅ 추가
  };
};
