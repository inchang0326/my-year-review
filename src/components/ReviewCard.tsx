import React, { useState } from "react";
import type { ReviewCategory, ReviewItem } from "../types";
import { CATEGORY_CONFIG } from "../utils/constants";

interface ReviewCardProps {
  category: ReviewCategory;
  items: ReviewItem[];
  onAddItem: (category: ReviewCategory, content: string) => void;
  onDeleteItem: (id: string) => void;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  category,
  items,
  onAddItem,
  onDeleteItem,
}) => {
  const [inputValue, setInputValue] = useState("");
  const config = CATEGORY_CONFIG[category];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAddItem(category, inputValue.trim());
      setInputValue("");
    }
  };

  const categoryItems = items.filter((item) => item.category === category);

  return (
    <div
      style={{
        backgroundColor: "var(--bg-card)",
        borderRadius: "1rem",
        padding: "1.5rem",
        boxShadow: "var(--shadow-lg)",
        border: "1px solid var(--border-color)",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          paddingBottom: "1rem",
          borderBottom: `2px solid var(--${config.color})`,
        }}
      >
        <span style={{ fontSize: "1.5rem" }}>{config.emoji}</span>
        <div>
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: "600",
              color: "var(--text-primary)",
            }}
          >
            {config.title}
          </h2>
          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--text-secondary)",
              marginTop: "0.25rem",
            }}
          >
            {config.description}
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="review-form"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          width: "100%",
        }}
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="항목을 입력하세요..."
          style={{
            width: "100%",
            padding: "0.75rem",
            borderRadius: "0.5rem",
            border: "1px solid var(--border-color)",
            backgroundColor: "var(--bg-secondary)",
            color: "var(--text-primary)",
            fontSize: "1rem",
            outline: "none",
            boxSizing: "border-box",
          }}
        />
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "0.75rem",
            borderRadius: "0.5rem",
            border: "none",
            backgroundColor: `var(--${config.color})`,
            color: "#ffffff",
            fontSize: "1rem",
            fontWeight: "600",
            transition: "opacity 0.2s",
            opacity: inputValue.trim() ? 1 : 0.5,
            cursor: inputValue.trim() ? "pointer" : "not-allowed",
          }}
          disabled={!inputValue.trim()}
        >
          추가
        </button>
      </form>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          maxHeight: "400px",
          overflowY: "auto",
        }}
      >
        {categoryItems.length === 0 ? (
          <p
            style={{
              textAlign: "center",
              color: "var(--text-secondary)",
              padding: "2rem",
              fontSize: "0.875rem",
            }}
          >
            아직 항목이 없습니다. 첫 항목을 추가해보세요!
          </p>
        ) : (
          categoryItems.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.75rem",
                borderRadius: "0.5rem",
                backgroundColor: `var(--${config.color}-light)`,
                border: "1px solid var(--border-color)",
                wordBreak: "break-word",
              }}
            >
              <span
                style={{
                  flex: 1,
                  color: "var(--text-primary)",
                  fontSize: "0.95rem",
                  paddingRight: "0.5rem",
                }}
              >
                {item.content}
              </span>
              <button
                onClick={() => onDeleteItem(item.id)}
                style={{
                  padding: "0.25rem 0.5rem",
                  borderRadius: "0.25rem",
                  border: "none",
                  backgroundColor: "transparent",
                  color: "var(--text-secondary)",
                  fontSize: "1.5rem",
                  lineHeight: "1",
                  transition: "color 0.2s",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
                aria-label="삭제"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
