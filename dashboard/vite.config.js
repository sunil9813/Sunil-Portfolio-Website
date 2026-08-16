import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 7000,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom", "react-redux", "@reduxjs/toolkit"],
          editor: ["@tiptap/react", "@tiptap/starter-kit", "reactjs-tiptap-editor"],
          pdf: ["pdfjs-dist", "react-pdf"],
          charts: ["recharts"],
          motion: ["framer-motion", "motion"],
          ui: ["@headlessui/react", "@material-tailwind/react", "lucide-react", "react-icons"],
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
    port: 5172,
    host: true,
  },
});
