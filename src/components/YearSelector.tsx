import React from "react";
import { AVAILABLE_YEARS } from "../utils/constants";

interface YearSelectorProps {
  selectedYear: number;
  onYearChange: (year: number) => void;
}

export const YearSelector: React.FC<YearSelectorProps> = ({
  selectedYear,
  onYearChange,
}) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "0.5rem",
        padding: "1.5rem",
        flexWrap: "wrap",
      }}
    >
      {AVAILABLE_YEARS.map((year) => (
        <button
          key={year}
          onClick={() => onYearChange(year)}
          style={{
            padding: "0.75rem 1.5rem",
            borderRadius: "0.5rem",
            border:
              selectedYear === year
                ? "2px solid var(--indigo)"
                : "1px solid var(--border-color)",
            backgroundColor:
              selectedYear === year ? "var(--indigo)" : "var(--bg-card)",
            color: selectedYear === year ? "#ffffff" : "var(--text-primary)",
            fontSize: "1rem",
            fontWeight: selectedYear === year ? "600" : "400",
            transition: "all 0.2s",
            boxShadow:
              selectedYear === year ? "var(--shadow-lg)" : "var(--shadow)",
          }}
        >
          {year}
        </button>
      ))}
    </div>
  );
};
