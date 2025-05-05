import React from "react";
import { RiskLevel } from "../../types/compliance";

const colorMap: Record<RiskLevel, string> = {
  HIGH: "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300 shadow-red-100",
  MEDIUM:
    "bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 border-amber-300 shadow-amber-100",
  LOW: "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300 shadow-green-100",
};

export const RiskBadge: React.FC<{ risk: RiskLevel }> = ({ risk }) => (
  <span
    className={`px-3 py-1 text-xs font-medium rounded-full border shadow-sm ${colorMap[risk]}`}
  >
    {risk}
  </span>
);
