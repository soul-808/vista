import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "compliance",
      filename: "remoteEntry.js",
      exposes: {
        "./ComplianceDashboard":
          "./src/components/mountComplianceDashboard.tsx",
        "./ComplianceWC": "./src/components/ComplianceDashboardWC.tsx",
      },
      shared: ["react", "react-dom"],
    }),
  ],
  server: {
    port: 4202,
    origin: "http://localhost:4202",
    strictPort: true,
    cors: true,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        format: "esm",
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
      },
    },
  },
  preview: {
    port: 4202,
    strictPort: true,
  },
});
