import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'flask_app/static/dist',
    manifest: true,       // generates manifest.json so Flask knows filenames
    rollupOptions: {
      input: 'src/index.jsx'
    }
  },
  server: {
    port: 5173,
    origin: 'http://localhost:5173'  // tells Vite where assets are served from in dev
  }
})
