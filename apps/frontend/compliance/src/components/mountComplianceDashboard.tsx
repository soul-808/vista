import React from "react";
import { createRoot } from "react-dom/client";
import ComplianceDashboard from "./ComplianceDashboard";

const mount = (container: HTMLElement) => {
  console.log("Mounting compliance dashboard to:", container);
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <ComplianceDashboard />
    </React.StrictMode>
  );
  return root; // Return the root for unmounting
};

// Export both named and default exports
export { mount };
export default mount;
