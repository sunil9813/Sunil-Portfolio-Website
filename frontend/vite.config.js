import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1800,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom", "react-redux", "@reduxjs/toolkit"],
          editor: ["@tiptap/react", "@tiptap/starter-kit"],
          motion: ["framer-motion", "motion"],
          content: ["html-react-parser", "highlight.js", "katex"],
          icons: ["react-icons"],
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
  },
});
