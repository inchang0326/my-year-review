import React from "react";

interface HeaderProps {
  selectedYear: number;
}

export const Header: React.FC<HeaderProps> = ({ selectedYear }) => {
  return (
    <header
      style={{
        textAlign: "center",
        padding: "2rem 1rem",
        borderBottom: "1px solid var(--border-color)",
        backgroundColor: "var(--bg-card)",
      }}
    >
      <h1
        style={{
          fontSize: "2.5rem",
          fontWeight: "700",
          marginBottom: "0.5rem",
          background: "linear-gradient(135deg, var(--indigo), var(--emerald))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {selectedYear}년 회고!
      </h1>
      <p
        style={{
          fontSize: "1rem",
          color: "var(--text-secondary)",
        }}
      >
        한 해를 돌아보고, 새로운 시작을 계획하세요
      </p>
    </header>
  );
};
