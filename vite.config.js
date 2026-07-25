import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  // ── Dev Proxy ──────────────────────────────────────────────
  // In development, /api requests are proxied to localhost:5000
  // so you don't hit CORS issues. In production (Vercel),
  // VITE_API_URL points to the deployed server instead.
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  },

  // ── Build Output ───────────────────────────────────────────
  build: {
    outDir: 'dist',
    sourcemap: false,
  }
})
