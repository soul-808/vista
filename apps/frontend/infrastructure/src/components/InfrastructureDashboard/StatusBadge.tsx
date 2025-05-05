import React from "react";
import { Check, AlertTriangle, TrendingDown } from "lucide-react";

type StatusType = "SUCCESS" | "FAIL" | "ROLLBACK" | "HIGH" | "MEDIUM" | "LOW";

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const colorMap: Record<StatusType, string> = {
    SUCCESS: "bg-green-100 text-green-800 border-green-200",
    FAIL: "bg-red-100 text-red-800 border-red-200",
    ROLLBACK: "bg-amber-100 text-amber-800 border-amber-200",
    HIGH: "bg-red-100 text-red-800 border-red-200",
    MEDIUM: "bg-amber-100 text-amber-800 border-amber-200",
    LOW: "bg-green-100 text-green-800 border-green-200",
  };

  // Use a default style if status is not in the map
  const badgeStyle =
    colorMap[status as StatusType] ||
    "bg-gray-100 text-gray-800 border-gray-200";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeStyle}`}
    >
      {status === "SUCCESS" && <Check size={14} className="mr-1" />}
      {status === "FAIL" && <AlertTriangle size={14} className="mr-1" />}
      {status === "ROLLBACK" && <TrendingDown size={14} className="mr-1" />}
      {status === "HIGH" && <AlertTriangle size={14} className="mr-1" />}
      {status === "MEDIUM" && <AlertTriangle size={14} className="mr-1" />}
      {status === "LOW" && <Check size={14} className="mr-1" />}
      {status}
    </span>
  );
};

export default StatusBadge;
