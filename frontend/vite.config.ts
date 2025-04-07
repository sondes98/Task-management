import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Exposes the server on all network interfaces
    port: 5173, 
    proxy: {
      '/api': 'http://localhost:5000', 
    },
  },
})
