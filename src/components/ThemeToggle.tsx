import React from "react";
import type { Theme } from "../types";

interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  theme,
  onToggle,
}) => {
  return (
    <button
      onClick={onToggle}
      style={{
        padding: "0.5rem 1rem",
        borderRadius: "0.5rem",
        border: "1px solid var(--border-color)",
        backgroundColor: "var(--bg-card)",
        color: "var(--text-primary)",
        fontSize: "1.5rem",
        transition: "all 0.2s",
        boxShadow: "var(--shadow)",
      }}
      aria-label="테마 전환"
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
};
