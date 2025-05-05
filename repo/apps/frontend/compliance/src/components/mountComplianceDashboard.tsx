import React from "react";
import { createRoot } from "react-dom/client";
import App from "../App";

const mount = (container: HTMLElement) => {
  console.log("Mounting compliance dashboard to:", container);
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App standalone={true} />
    </React.StrictMode>
  );
  return root; // Return the root for unmounting
};

export default mount;
