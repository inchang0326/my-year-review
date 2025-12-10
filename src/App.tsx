import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { YearSelector } from "./components/YearSelector";
import { ReviewBoard } from "./components/ReviewBoard";
import { ThemeToggle } from "./components/ThemeToggle";
import { useLocalStorage } from "./hooks/useLocalStorage";
import type { ReviewItem, ReviewCategory, YearReview, Theme } from "./types";
import { CURRENT_YEAR, STORAGE_KEYS } from "./utils/constants";
import { usePWA } from "./hooks/usePWA";
import "./styles/globals.css";
import "./App.css";

export const App: React.FC = () => {
  const { needRefresh, confirmUpdate } = usePWA();
  const [selectedYear, setSelectedYear] = useState<number>(CURRENT_YEAR);
  const [reviews, setReviews] = useLocalStorage<YearReview[]>(
    STORAGE_KEYS.REVIEWS,
    []
  );
  const [theme, setTheme] = useLocalStorage<Theme>(STORAGE_KEYS.THEME, "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const getCurrentYearReview = (): ReviewItem[] => {
    const yearReview = reviews.find((review) => review.year === selectedYear);
    return yearReview?.items || [];
  };

  const handleAddItem = (category: ReviewCategory, content: string): void => {
    const newItem: ReviewItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      category,
      content,
      createdAt: Date.now(),
    };

    setReviews((prevReviews) => {
      const existingReviewIndex = prevReviews.findIndex(
        (review) => review.year === selectedYear
      );

      if (existingReviewIndex >= 0) {
        const updatedReviews = [...prevReviews];
        updatedReviews[existingReviewIndex] = {
          ...updatedReviews[existingReviewIndex],
          items: [...updatedReviews[existingReviewIndex].items, newItem],
        };
        return updatedReviews;
      } else {
        return [...prevReviews, { year: selectedYear, items: [newItem] }];
      }
    });
  };

  const handleDeleteItem = (id: string): void => {
    setReviews((prevReviews) =>
      prevReviews.map((review) =>
        review.year === selectedYear
          ? { ...review, items: review.items.filter((item) => item.id !== id) }
          : review
      )
    );
  };

  const handleToggleTheme = (): void => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-primary)" }}>
      <div
        style={{
          position: "fixed",
          top: "1rem",
          right: "1rem",
          zIndex: 1000,
        }}
      >
        <ThemeToggle theme={theme} onToggle={handleToggleTheme} />
      </div>
      <Header selectedYear={selectedYear} />
      <YearSelector
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
      />
      <ReviewBoard
        items={getCurrentYearReview()}
        onAddItem={handleAddItem}
        onDeleteItem={handleDeleteItem}
      />

      {needRefresh && (
        <div className="toast">
          <span className="toast__message">새 버전이 있습니다.</span>
          <button className="toast__action" onClick={confirmUpdate}>
            업데이트
          </button>
        </div>
      )}
    </div>
  );
};
