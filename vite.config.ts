import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/airshipbeta/',
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
})