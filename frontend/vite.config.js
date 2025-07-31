import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: ["cinezone.info"],
    open: true,
  },
  define: {
    "process.env": {}, // Shim process.env to an empty object
  },
  build: {
    target: "esnext", // Support modern features including top-level await
  },
});
