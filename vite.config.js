import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    port: 5173,
    proxy: {
      '/rr-api': {
        target: 'https://api.railradar.in/v1',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/rr-api/, '')
      }
    }
  }
})
