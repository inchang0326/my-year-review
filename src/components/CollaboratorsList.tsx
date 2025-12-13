import React from "react";
import type { Collaborator } from "../types";

interface CollaboratorsListProps {
  collaborators: Collaborator[];
}

export const CollaboratorsList: React.FC<CollaboratorsListProps> = ({
  collaborators,
}) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        flexWrap: "wrap",
      }}
    >
      {collaborators.map((collaborator) => (
        <div
          key={collaborator.userId}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.5rem 0.75rem",
            borderRadius: "0.5rem",
            backgroundColor: collaborator.color,
            color: "#ffffff",
            fontSize: "0.875rem",
            fontWeight: "500",
          }}
          title={`${collaborator.name} - ${new Date(
            collaborator.joinedAt
          ).toLocaleTimeString()}`}
        >
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              backgroundColor: "#ffffff",
              opacity: 0.7,
            }}
          />
          {collaborator.name}
        </div>
      ))}
    </div>
  );
};
