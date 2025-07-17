import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Ensure React is properly resolved
      'react': 'react',
      'react-dom': 'react-dom'
    }
  },
  build: {
    // Increase warning limit or adjust as needed
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Simplified chunk splitting to avoid React context issues
        manualChunks: {
          // Keep React and related libraries together
          'react-vendor': ['react', 'react-dom'],
          // Three.js libraries
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
          // UI libraries  
          'ui-vendor': ['lucide-react', '@emoji-mart/react', '@emoji-mart/data'],
          // Other libraries
          'vendor': ['axios', 'zustand', 'socket.io-client', 'react-hot-toast', 'react-router-dom']
        }
      }
    }
  }
})
