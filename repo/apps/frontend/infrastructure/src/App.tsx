import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, MemoryRouter } from "react-router-dom";
import InfrastructureDashboard from "./components/InfrastructureDashboard";

// Create a singleton QueryClient instance
const queryClient = new QueryClient();

interface AppProps {
  initialPath?: string;
  standalone?: boolean;
  useTestDashboard?: boolean;
}

function App({ initialPath = "/", standalone = false }: AppProps) {
  console.log(
    "React App mounted with initial path:",
    initialPath,
    "standalone:",
    standalone
  );

  // Content to render with or without our own router
  const content = (
    <Routes>
      <Route index element={<InfrastructureDashboard />} />
      {/* Add child routes here. These will be relative to the parent route in the shell */}
      {/* Example: <Route path="details/:id" element={<InfrastructureDetails />} /> */}
    </Routes>
  );

  return (
    <QueryClientProvider client={queryClient}>
      {standalone ? (
        <MemoryRouter initialEntries={[initialPath]}>{content}</MemoryRouter>
      ) : (
        // When used inside the shell, don't add our own router
        content
      )}
    </QueryClientProvider>
  );
}

export default App;
