import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Increase warning limit or adjust as needed
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Split vendor code into granular chunks
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Separate React core libs
            if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
              return 'react-vendor';
            }
            // Icons library
            if (id.includes('node_modules/lucide-react')) {
              return 'icons';
            }
            // Emoji picker
            if (id.includes('node_modules/emoji-picker-react')) {
              return 'emoji-picker';
            }
            // Other third-party modules
            return 'vendor';
          }
        }
      }
    }
  }
})
