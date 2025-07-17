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
            // Keep React and ReactDOM together and ensure single instance
            if (id.includes('react') && !id.includes('react-router') && !id.includes('react-hot-toast') && !id.includes('@react-three')) {
              return 'react-vendor';
            }
            // Three.js and related
            if (id.includes('three') || id.includes('@react-three')) {
              return 'three-vendor';
            }
            // Icons library
            if (id.includes('lucide-react')) {
              return 'icons';
            }
            // Emoji picker
            if (id.includes('@emoji-mart')) {
              return 'emoji-picker';
            }
            // Socket.io
            if (id.includes('socket.io')) {
              return 'socket-vendor';
            }
            // Other third-party modules
            return 'vendor';
          }
        }
      }
    }
  }
})
