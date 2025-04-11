import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Exposes the server on all network interfaces
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Backend server URL
        changeOrigin: true,              // Ensures that the origin of the host header is changed
        rewrite: (path) => path.replace(/^\/api/, ''), // Strips /api prefix before sending to the backend
      },
    },
  },
})
