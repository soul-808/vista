import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ComplianceDashboard from "./components/ComplianceDashboard";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<ComplianceDashboard />} />
          {/* Add more routes here as needed */}
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
