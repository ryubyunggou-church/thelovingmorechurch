import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/firebase')) return 'firebase'
          if (
            id.includes('node_modules/react-dom') ||
            id.includes('node_modules/react-router') ||
            id.includes('node_modules/react/')
          ) {
            return 'vendor'
          }
        },
      },
    },
  },
})
