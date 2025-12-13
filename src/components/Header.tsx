import React from "react";
import type { Theme } from "../types";

interface HeaderProps {
  selectedYear: number;
  theme: Theme;
  onToggleTheme: () => void;
  onOpenMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedYear,
  theme,
  onToggleTheme,
  onOpenMenu,
}) => {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 2000,
        backgroundColor: "var(--bg-primary)",
        borderBottom: "1px solid var(--border-color)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "40px 1fr 88px",
          alignItems: "center",
          gap: "8px",
          padding: "14px 16px",
          boxSizing: "border-box",
        }}
      >
        {/* 왼쪽 공간(중앙 정렬 균형용) */}
        <div style={{ width: 40, height: 40 }} />

        {/* 중앙 타이틀 */}
        <div style={{ minWidth: 0, textAlign: "center" }}>
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "700",
              marginBottom: "0.5rem",
              background:
                "linear-gradient(135deg, var(--indigo), var(--emerald))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {selectedYear}년 회고
          </h1>
        </div>

        {/* 오른쪽 버튼들 */}
        <div
          style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}
        >
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label="테마 전환"
            title="테마"
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              border: "1px solid var(--border-color)",
              backgroundColor: "var(--bg-card)",
              color: "var(--text-primary)",
              fontWeight: 900,
              cursor: "pointer",
            }}
          >
            {theme === "light" ? "☀️" : "🌙"}
          </button>

          <button
            type="button"
            onClick={onOpenMenu}
            aria-label="설정"
            title="설정"
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              border: "1px solid var(--border-color)",
              backgroundColor: "var(--bg-card)",
              color: "var(--text-primary)",
              fontWeight: 900,
              cursor: "pointer",
            }}
          >
            ☰
          </button>
        </div>
      </div>
    </header>
  );
};
