import React, { useEffect } from "react";
import { ChatPanel } from "./ChatPanel";

const SummaryDashboard: React.FC = () => {
  useEffect(() => {
    // Ensure the body doesn't scroll
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <ChatPanel />
    </div>
  );
};

export default SummaryDashboard;
