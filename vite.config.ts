import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react()
   
  ],
  server: {
    headers: {
      // Required for Firebase Auth popups/redirects to work
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
      'Cross-Origin-Embedder-Policy': 'unsafe-none',
      
      // Optional but recommended for development
      'Access-Control-Allow-Origin': '*',
    },
    // Ensure proper host configuration
    host: true,
    port: 5173,
    strictPort: true,
  },
  // For production build if needed
  preview: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
      'Cross-Origin-Embedder-Policy': 'unsafe-none',
    }
  }
})