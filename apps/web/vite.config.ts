import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    allowedHosts: ["mentalia.borderlink.mx"],
    hmr: {
      clientPort: 443
    },
    watch: {
      usePolling: true
    }
  }
})
