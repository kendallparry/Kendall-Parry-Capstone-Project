import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'flask_app/static/dist',
    manifest: true,       // generates manifest.json so Flask knows filenames
    rollupOptions: {
      input: 'static/index.jsx'
    }
  },
})
