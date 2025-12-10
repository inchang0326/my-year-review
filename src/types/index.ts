export type ReviewCategory = "start" | "stop" | "continue";

export interface ReviewItem {
  id: string;
  category: ReviewCategory;
  content: string;
  createdAt: number;
}

export interface YearReview {
  year: number;
  items: ReviewItem[];
}

export type Theme = "light" | "dark";
