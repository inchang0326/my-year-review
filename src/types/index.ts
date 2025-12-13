export type ReviewCategory = "start" | "stop" | "continue";

export interface ReviewItem {
  id: string;
  category: ReviewCategory;
  content: string;
  createdAt: number;
  createdBy: string; // ← 신규: 누가 생성했는지
}

export interface YearReview {
  year: number;
  items: ReviewItem[];
}

export type Theme = "light" | "dark";

// ========== 신규: 협업 관련 타입 ==========

export interface CollaborationSession {
  id: string; // 초대 코드
  creatorId: string;
  creatorName: string;
  year: number;
  items: ReviewItem[];
  collaborators: Collaborator[];
  createdAt: number;
  expiresAt: number; // 7일 후
}

export interface Collaborator {
  userId: string;
  name: string;
  email?: string;
  joinedAt: number;
  color: string; // 사용자 고유 색상
}

export interface User {
  userId: string;
  name: string;
  sessionId?: string; // 참여 중인 세션
}
