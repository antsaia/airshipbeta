import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: "https://antsaia.github.io/airshipbeta/",
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})