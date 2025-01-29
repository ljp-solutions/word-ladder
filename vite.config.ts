import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3003,
    host: true, // Add this to expose to all network interfaces
  },
  root: '.',
  build: {
    outDir: 'dist'
  }
})
