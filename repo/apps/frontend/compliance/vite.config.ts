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
        "./App": {
          import: "./src/App.tsx",
          name: "App",
        },
        "./ComplianceDashboard":
          "./src/components/mountComplianceDashboard.tsx",
        "./ComplianceWC": "./src/components/ComplianceDashboardWC.tsx",
      },
      // Use 'as any' to bypass TypeScript's type checking which doesn't match the actual API
      shared: {
        react: {
          singleton: true,
          version: "19.0.0",
          requiredVersion: "19.0.0",
        },
        "react-dom": {
          singleton: true,
          version: "19.0.0",
          requiredVersion: "19.0.0",
        },
        "@tanstack/react-query": {
          singleton: true,
          version: "5.75.2",
          requiredVersion: "5.75.2",
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
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
