import React from "react";
import type { ReviewCategory, ReviewItem } from "../types";
import { ReviewCard } from "./ReviewCard";

interface ReviewBoardProps {
  items: ReviewItem[];
  onAddItem: (category: ReviewCategory, content: string) => void;
  onDeleteItem: (id: string) => void;
}

export const ReviewBoard: React.FC<ReviewBoardProps> = ({
  items,
  onAddItem,
  onDeleteItem,
}) => {
  const categories: ReviewCategory[] = ["start", "stop", "continue"];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
        gap: "1.5rem",
        padding: "1.5rem",
        maxWidth: "1400px",
        margin: "0 auto",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {categories.map((category) => (
        <ReviewCard
          key={category}
          category={category}
          items={items}
          onAddItem={onAddItem}
          onDeleteItem={onDeleteItem}
        />
      ))}
    </div>
  );
};
