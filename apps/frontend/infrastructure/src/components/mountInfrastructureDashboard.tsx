import { createRoot } from "react-dom/client";
import App from "../App";

/**
 * Mount the Infrastructure Dashboard to the specified DOM element.
 *
 * @param element - The DOM element to mount to
 * @param initialPath - The initial path to navigate to
 * @returns A function to unmount the dashboard
 */
function mountInfrastructureDashboard(element: HTMLElement, initialPath = "/") {
  const root = createRoot(element);
  root.render(<App initialPath={initialPath} />);

  return () => root.unmount();
}

export default mountInfrastructureDashboard;
